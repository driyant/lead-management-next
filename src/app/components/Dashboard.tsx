"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Grid,
  GridItem,
  Heading,
  Text,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Badge,
  useToast,
  Flex,
  Icon,
  Container,
} from "@chakra-ui/react";
import { FiUser, FiMail, FiPlus, FiBriefcase } from "react-icons/fi";
import { Lead } from "../interface";
import api from "../lib/api";
import axios from "axios";
import { formattedDate, normalizeEmail } from "../utils";
import LoadingSkeleton from "./LoadingSkeleton";

type DashboardProps = {
  initialLeads?: Lead[];
  isLeadsLoading?: boolean;
};

export default function Dashboard({
  initialLeads = [],
  isLeadsLoading = false,
}: DashboardProps) {
  const router = useRouter();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    status: "NEW",
  });

  const getStatusColor = (status: string) => {
    const formatted = status ? status.toLowerCase().trim() : "";

    if (formatted === "new") return "blue";
    if (formatted === "engaged") return "orange";
    if (formatted === "proposal_sent") return "purple";
    if (formatted === "closed_won") return "green";
    if (formatted === "closed_lost") return "red";
    return "gray";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.post("/api/leads", formData);
      toast({
        title: "Lead created.",
        description: `${formData.name} has been added successfully.`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });

      // Reset form
      setFormData({ name: "", email: "", status: "NEW" });
      router.refresh();
    } catch (error: any) {
      const errorMessage =
        axios.isAxiosError(error) && error.response
          ? error.response.data.message || "Failed to create lead"
          : "An unexpected error occurred";

      toast({
        title: "Error.",
        description: errorMessage,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="7xl" py={10}>
      <Flex alignItems="center" mb={8} gap={3}>
        <Box p={3} bg="blue.500" color="white" borderRadius="lg" shadow="sm">
          <Icon as={FiBriefcase} boxSize={6} />
        </Box>
        <Box>
          <Heading size="lg" color="gray.800">
            Lead Manager
          </Heading>
          <Text color="gray.500">
            Manage your prospective clients efficiently
          </Text>
        </Box>
      </Flex>

      <Grid templateColumns={{ base: "1fr", lg: "350px 1fr" }} gap={8}>
        <GridItem>
          <Box
            bg="white"
            p={6}
            borderRadius="xl"
            shadow="sm"
            border="1px solid"
            borderColor="gray.100"
          >
            <Heading size="md" mb={6} color="gray.700">
              Add New Lead
            </Heading>
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel fontSize="sm" color="gray.600">
                    Full Name
                  </FormLabel>
                  <Input
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    focusBorderColor="blue.500"
                    bg="gray.50"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontSize="sm" color="gray.600">
                    Email Address
                  </FormLabel>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        email: normalizeEmail(e.target.value),
                      })
                    }
                    focusBorderColor="blue.500"
                    bg="gray.50"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel fontSize="sm" color="gray.600">
                    Initial Status
                  </FormLabel>
                  <Select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    focusBorderColor="blue.500"
                    bg="gray.50"
                  >
                    <option value="NEW">NEW</option>
                    <option value="ENGAGED">ENGAGED</option>
                    <option value="PROPOSAL_SENT">PROPOSAL SENT</option>
                    <option value="CLOSED_WON">CLOSED WON</option>
                    <option value="CLOSED_LOST">CLOSED LOST</option>
                  </Select>
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="blue"
                  size="md"
                  width="full"
                  mt={4}
                  isLoading={isLoading}
                  leftIcon={<FiPlus />}
                  shadow="md"
                >
                  Save Lead
                </Button>
              </VStack>
            </form>
          </Box>
        </GridItem>

        <GridItem>
          <Box
            bg="white"
            borderRadius="xl"
            shadow="sm"
            border="1px solid"
            borderColor="gray.100"
            overflow="hidden"
          >
            <TableContainer>
              <Table variant="simple">
                <Thead bg="gray.50">
                  <Tr>
                    <Th color="gray.500" fontSize="xs">
                      Name
                    </Th>
                    <Th color="gray.500" fontSize="xs">
                      Email
                    </Th>
                    <Th color="gray.500" fontSize="xs">
                      Status
                    </Th>
                    <Th color="gray.500" fontSize="xs">
                      Date Added
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {isLeadsLoading ? (
                    <LoadingSkeleton />
                  ) : initialLeads.length === 0 ? (
                    <Tr>
                      <Td
                        colSpan={4}
                        textAlign="center"
                        py={10}
                        color="gray.500"
                      >
                        No leads found. Create your first lead!
                      </Td>
                    </Tr>
                  ) : (
                    initialLeads.map((lead) => (
                      <Tr key={lead.id} _hover={{ bg: "gray.50" }}>
                        <Td fontWeight="medium" color="gray.800">
                          <Flex align="center" gap={2}>
                            <Icon as={FiUser} color="gray.400" />
                            {lead.name}
                          </Flex>
                        </Td>
                        <Td color="gray.600">
                          <Flex align="center" gap={2}>
                            <Icon as={FiMail} color="gray.400" />
                            {lead.email}
                          </Flex>
                        </Td>
                        <Td>
                          <Badge
                            colorScheme={getStatusColor(lead.status)}
                            px={2}
                            py={1}
                            borderRadius="md"
                            variant="subtle"
                          >
                            {lead.status}
                          </Badge>
                        </Td>
                        <Td color="gray.500" fontSize="sm">
                          {formattedDate(lead.createdAt)}
                        </Td>
                      </Tr>
                    ))
                  )}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
        </GridItem>
      </Grid>
    </Container>
  );
}
