import { useState, useEffect } from "react";
import axiosInstance from "../../axiosInstance";
import { Link } from "react-router-dom";
import { File, Upload, Home, User } from "lucide-react";

const API_BASE_URL = "http://127.0.0.1:8000/api";

const Files = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState("No file selected");

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axiosInstance.get(`${API_BASE_URL}/files/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFiles(response.data);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file.");
      return;
    }
    
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("description", description);
      
      const token = localStorage.getItem("access_token");
      await axiosInstance.post(`${API_BASE_URL}/files/`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`, 
          "Content-Type": "multipart/form-data" 
        },
      });
      
      setSelectedFile(null);
      setDescription("");
      setFileName("No file selected");
      fetchFiles();
      alert("File uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const getFileIcon = (fileType) => {
    switch(fileType.toLowerCase()) {
      case 'pdf': return '📄';
      case 'jpg':
      case 'jpeg':
      case 'png': return '🖼️';
      case 'doc':
      case 'docx': return '📝';
      case 'xls':
      case 'xlsx': return '📊';
      default: return '📁';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-xl rounded-lg">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">File Management</h1>
        
        <div className="flex justify-end space-x-4 mb-6">
          <Link to="/dashboard" className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition-colors">
            <Home size={16} />
            <span>Dashboard</span>
          </Link>
          <Link to="/profile" className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition-colors">
            <User size={16} />
            <span>Profile</span>
          </Link>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Upload a New File</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">File</label>
            <div className="flex items-center">
              <label className="cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-l-md border border-blue-200 transition-colors">
                <Upload size={16} className="inline mr-2" />
                Browse...
                <input 
                  type="file" 
                  onChange={handleFileChange} 
                  className="hidden" 
                />
              </label>
              <div className="flex-1 border border-gray-300 border-l-0 rounded-r-md py-2 px-3 bg-white text-gray-500 text-sm truncate">
                {fileName}
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea 
              placeholder="Add a description for your file..." 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              rows="3"
            />
          </div>
          
          <button 
            onClick={handleUpload} 
            disabled={isUploading || !selectedFile}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition-colors flex items-center justify-center ${isUploading || !selectedFile ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isUploading ? 'Uploading...' : 'Upload File'}
          </button>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
          <File size={20} className="mr-2" />
          Your Files
        </h3>
        
        {files.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No files uploaded yet. Upload your first file above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Uploaded</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {files.map((file) => {
                  const fileName = file.file.split("/").pop();
                  const fileType = file.file_type.toLowerCase();
                  
                  return (
                    <tr key={file.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm">
                        <a 
                          href={file.file_url} 
                          download 
                          className="flex items-center text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          <span className="mr-2">{getFileIcon(fileType)}</span>
                          <span className="truncate max-w-xs">{fileName}</span>
                        </a>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date(file.upload_date).toLocaleDateString(undefined, { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {file.file_type.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Files;