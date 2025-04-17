import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';


const ParticipantDetails = () => {
  const [teamName, setTeamName] = useState('');
  const [teamLeader, setTeamLeader] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [members, setMembers] = useState([{ name: '', email: '', phone: '' }]);
  const [isModalOpen, setIsModalOpen] = useState(true); 
  const navigate = useNavigate(); 
  const {id}  = useParams();

  const handleInputChange = (index, event) => {
    const updatedMembers = [...members];
    updatedMembers[index][event.target.name] = event.target.value;
    setMembers(updatedMembers);
  };

  const handleLeaderChange = (event) => {
    setTeamLeader({
      ...teamLeader,
      [event.target.name]: event.target.value
    });
  };

  const handleAddMember = () => {
    setMembers([...members, { name: '', email: '', phone: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const requestData = {
        application: {
          hackathon_id: id, // Replace with the actual hackathon ID
          team_name: teamName,
          team_leader_name: teamLeader.name,
          team_leader_email: teamLeader.email,
          team_leader_phone: teamLeader.phone
        },
        teamMembers: members.map(member => ({
          member_name: member.name,
          member_email: member.email,
          member_phone: member.phone
        }))
      };

      const response = await axios.post('http://127.0.0.1:8787/hackathon/apply', requestData);

      console.log('Response:', response.data);
      alert('Registration successful!');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error submitting form:', error.response?.data || error.message);
      alert('Failed to register. Please try again.');
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    isModalOpen && (
      <div className="flex justify-center items-center min-h-screen bg-gray-700 bg-opacity-50 fixed inset-0 z-50">
        <form onSubmit={handleSubmit} className="bg-white w-full max-w-xl p-6 rounded-lg shadow-lg overflow-y-auto">
          <div className="absolute top-2 right-2 text-gray-500 cursor-pointer">
            <button type="button" className="text-4xl text-black hover:text-red-600 mt-12" onClick={handleClose}>
              &times;
            </button>
          </div>

          <div className="mb-6">
            <h2 className="text-gray-800 font-semibold text-lg mb-4">Fill up your details for registration</h2>
            <label className="block text-gray-700 font-semibold mb-2">Team Name</label>
            <input
              type="text"
              name="teamName"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full p-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-6">
            <h3 className="text-gray-800 font-semibold text-lg mb-4">Team Leader Details</h3>
            {['name', 'email', 'phone'].map((field, index) => (
              <div key={index}>
                <label className="block text-gray-700 font-semibold capitalize">{field.replace('_', ' ')}</label>
                <input
                  type={field === 'email' ? 'email' : 'text'}
                  name={field}
                  value={teamLeader[field]}
                  onChange={handleLeaderChange}
                  className="w-full p-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            ))}
          </div>

          <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-6">
            <h3 className="text-gray-800 font-semibold text-lg mb-4">Team Member Details</h3>
            {members.map((member, index) => (
              <div key={index} className="space-y-4 mb-4">
                {['name', 'email', 'phone'].map((field, i) => (
                  <div key={i}>
                    <label className="block text-gray-700 font-semibold capitalize">Member {index + 1} {field}</label>
                    <input
                      type={field === 'email' ? 'email' : 'text'}
                      name={field}
                      value={member[field]}
                      onChange={(e) => handleInputChange(index, e)}
                      className="w-full p-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                ))}
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddMember}
              className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500"
            >
              Add Team Member
            </button>
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500"
            >
              Submit Application
            </button>
          </div>
        </form>
      </div>
    )
  );
};

export default ParticipantDetails;
