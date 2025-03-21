import Web3 from "web3";

const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");

// Replace with the actual deployed contract address
const contractAddress: string = "0xYourContractAddressHere";

// Smart Contract ABI
const contractABI: any[] = [
  {
    inputs: [
      { internalType: "string", name: "_patientId", type: "string" },
      { internalType: "string", name: "_data", type: "string" },
    ],
    name: "addOrUpdateRecord",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "_patientId", type: "string" }],
    name: "getRecord",
    outputs: [
      { internalType: "string", name: "", type: "string" },
      { internalType: "string", name: "", type: "string" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
];

// Initialize contract instance
const medicalRecordsContract = new web3.eth.Contract(contractABI, contractAddress);

// Function to add or update a medical record
export const addMedicalRecord = async (patientId: string, data: string): Promise<void> => {
  try {
    const accounts: string[] = await web3.eth.requestAccounts();
    const receipt = await medicalRecordsContract.methods
      .addOrUpdateRecord(patientId, data)
      .send({ from: accounts[0] });

    console.log("Transaction successful:", receipt.transactionHash);
  } catch (error) {
    console.error("Error adding/updating record:", error);
    throw new Error("Failed to add/update medical record.");
  }
};

// Function to retrieve a medical record
export const getMedicalRecord = async (patientId: string): Promise<{ data: string; timestamp: number }> => {
  try {
    const [retrievedData, , timestamp]: [string, string, number] = await medicalRecordsContract.methods
      .getRecord(patientId)
      .call();

    return { data: retrievedData, timestamp };
  } catch (error) {
    console.error("Error fetching record:", error);
    throw new Error("Failed to fetch medical record.");
  }
};

// Function to check if MetaMask is connected
export const checkMetaMaskConnection = async (): Promise<boolean> => {
  try {
    const accounts: string[] = await web3.eth.requestAccounts();
    return accounts.length > 0;
  } catch (error) {
    console.error("MetaMask connection error:", error);
    return false;
  }
};
