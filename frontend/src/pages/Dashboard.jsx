import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { FileText, Users, FileType2, TrendingUp, Loader } from "lucide-react";
import axiosInstance from "../../axiosInstance";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalFiles: 0,
    fileTypes: {},
    usersFileCount: {},
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get("/dashboard/", {
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = response.data;
        // Simulate a loading delay if needed
        setTimeout(() => {
          setStats(data);
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Transform data for charts
  const fileTypeData = Object.entries(stats.fileTypes).map(([name, value]) => ({
    name: name.toUpperCase(),
    value,
  }));

  const userFileData = Object.entries(stats.usersFileCount).map(([name, value]) => ({
    name,
    files: value,
  }));

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  // Stat Card Component
  const StatCard = ({ icon, title, value, bgColor }) => (
    <div className={`${bgColor} rounded-lg shadow p-4 flex items-center`}>
      <div className="rounded-full bg-white bg-opacity-30 p-3 mr-4">
        {icon}
      </div>
      <div>
        <h3 className="text-white text-sm font-medium">{title}</h3>
        <p className="text-white text-2xl font-bold">{value}</p>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin h-8 w-8 text-blue-500" />
        <span className="ml-2 text-gray-600">Loading dashboard data...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <TrendingUp className="mr-2" />
            Dashboard Overview
          </h1>
          <p className="text-gray-600 mt-1">File management analytics and statistics</p>
        </div>

        {/* Stats Cards */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard 
            icon={<FileText className="h-6 w-6 text-blue-600" />} 
            title="Total Files" 
            value={stats.totalFiles} 
            bgColor="bg-blue-500"
          />
          <StatCard 
            icon={<FileType2 className="h-6 w-6 text-green-600" />} 
            title="File Types" 
            value={Object.keys(stats.fileTypes).length} 
            bgColor="bg-green-500"
          />
          <StatCard 
            icon={<Users className="h-6 w-6 text-purple-600" />} 
            title="Active Users" 
            value={Object.keys(stats.usersFileCount).length} 
            bgColor="bg-purple-500"
          />
        </div>

        {/* Charts and Detailed Stats */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* File Type Breakdown */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FileType2 className="mr-2 h-5 w-5 text-blue-500" />
              File Type Breakdown
            </h2>
            
            {fileTypeData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={fileTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {fileTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500">
                No file type data available
              </div>
            )}
            
            <div className="mt-4 grid grid-cols-2 gap-2">
              {Object.entries(stats.fileTypes).map(([type, count]) => (
                <div key={type} className="flex items-center p-2 rounded bg-gray-50">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[Object.keys(stats.fileTypes).indexOf(type) % COLORS.length] }}></div>
                  <span className="text-sm font-medium text-gray-700">{type.toUpperCase()}: </span>
                  <span className="ml-1 text-sm text-gray-900">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* User File Counts */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Users className="mr-2 h-5 w-5 text-purple-500" />
              Files Uploaded Per User
            </h2>
            
            {userFileData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={userFileData}
                    margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                  >
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="files" name="Files" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500">
                No user file data available
              </div>
            )}
            
            <div className="mt-4 overflow-y-auto max-h-32">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Files</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(stats.usersFileCount).map(([username, count]) => (
                    <tr key={username} className="hover:bg-gray-50">
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{username}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
