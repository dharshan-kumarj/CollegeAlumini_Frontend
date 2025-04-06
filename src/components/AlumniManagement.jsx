import React, { useState, useEffect } from 'react';
import {
  Box, 
  Table, 
  Thead, 
  Tbody, 
  Tr, 
  Th, 
  Td, 
  Heading, 
  Spinner, 
  Text, 
  Flex, 
  Button,
  IconButton,
  useToast,
  Badge,
  Avatar,
  Stack,
} from '@chakra-ui/react';
import { FiEdit, FiTrash2, FiEye } from 'react-icons/fi';
import axios from 'axios';
import { alumniService } from '../services/alumniService';

const AlumniManagement = () => {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [perPage] = useState(10);
  const toast = useToast();

  useEffect(() => {
    fetchAlumni();
  }, [currentPage]);

  const fetchAlumni = async () => {
    setLoading(true);
    try {
      const response = await alumniService.getAllAlumni(currentPage, perPage);
      
      setAlumni(response.data);
      setTotalPages(Math.ceil(response.total / perPage));
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch alumni data');
      toast({
        title: 'Error',
        description: err.message || 'Failed to fetch alumni data',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

  const handleViewDetails = (id) => {
    // Implement view functionality
    console.log('View details for alumni ID:', id);
  };

  const handleEditAlumni = (id) => {
    // Implement edit functionality
    console.log('Edit alumni ID:', id);
  };

  const handleDeleteAlumni = async (id) => {
    try {
      // Add confirmation
      if (!window.confirm('Are you sure you want to delete this alumni?')) {
        return;
      }
      
      // Get token
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      // Delete alumni
      await axios.delete(
        `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/admin/alumni/${id}`,
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      // Show success message
      toast({
        title: 'Success',
        description: 'Alumni deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // Refresh alumni list
      fetchAlumni();
      
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to delete alumni',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" height="400px">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex justify="center" align="center" height="200px">
        <Text color="red.500">{error}</Text>
      </Flex>
    );
  }

  return (
    <Box p={5}>
      <Heading size="lg" mb={6}>Alumni Management</Heading>
      
      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Profile</Th>
              <Th>Full Name</Th>
              <Th>Username</Th>
              <Th>Email</Th>
              <Th>Graduation Year</Th>
              <Th>Current Location</Th>
              <Th>Mentorship</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {alumni.length > 0 ? (
              alumni.map((alumnus) => (
                <Tr key={alumnus.alumni_id}>
                  <Td>
                    <Avatar 
                      name={alumnus.full_name} 
                      src={alumnus.profile_image} 
                      size="sm" 
                    />
                  </Td>
                  <Td>{alumnus.full_name}</Td>
                  <Td>{alumnus.username}</Td>
                  <Td>{alumnus.email}</Td>
                  <Td>{alumnus.graduation_year || 'N/A'}</Td>
                  <Td>{alumnus.current_location || 'N/A'}</Td>
                  <Td>
                    <Badge 
                      colorScheme={alumnus.availability_for_mentorship ? 'green' : 'gray'}
                    >
                      {alumnus.availability_for_mentorship ? 'Available' : 'Unavailable'}
                    </Badge>
                  </Td>
                  <Td>
                    <Stack direction="row" spacing={2}>
                      <IconButton
                        aria-label="View alumni"
                        icon={<FiEye />}
                        size="sm"
                        colorScheme="blue"
                        onClick={() => handleViewDetails(alumnus.alumni_id)}
                      />
                      <IconButton
                        aria-label="Edit alumni"
                        icon={<FiEdit />}
                        size="sm"
                        colorScheme="teal"
                        onClick={() => handleEditAlumni(alumnus.alumni_id)}
                      />
                      <IconButton
                        aria-label="Delete alumni"
                        icon={<FiTrash2 />}
                        size="sm"
                        colorScheme="red"
                        onClick={() => handleDeleteAlumni(alumnus.alumni_id)}
                      />
                    </Stack>
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={8}>
                  <Text textAlign="center">No alumni found</Text>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Box>
      
      {alumni.length > 0 && (
        <Flex justifyContent="center" mt={5}>
          <Button
            isDisabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            mr={2}
          >
            Previous
          </Button>
          <Text alignSelf="center" mx={2}>
            Page {currentPage} of {totalPages}
          </Text>
          <Button
            isDisabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            ml={2}
          >
            Next
          </Button>
        </Flex>
      )}
    </Box>
  );
};

export default AlumniManagement;