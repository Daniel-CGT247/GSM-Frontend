// import {
//   Button,
//   Container,
//   Flex,
//   Heading,
//   useDisclosure,
//   SimpleGrid,
//   GridItem,
// } from "@chakra-ui/react";
// import React, { useState } from "react";
// import {
//   IoArrowBackCircleOutline,
//   IoCheckmarkCircleOutline,
// } from "react-icons/io5";
// import { useParams } from "react-router-dom";
// import JobDrawer from "../components/JobDrawer";
// import StyleSkeleton from "../components/StyleSkeleton";
// import useGet from "../customed_hook/useGet";
// import endpoint from "../utils/endpoint";
// import OperationLib from "./OperationLib";
// import OperationList from "./OperationList";

// export default function Operation() {
//   const { listId, jobId, bundleId } = useParams();
//   const { data: styleNum, isLoading: isStyleLoading } = useGet(
//     `${endpoint}/collection/${listId}`
//   );
//   const itemName = styleNum && styleNum.item && styleNum.item.name;

//   const { data: jobGroup, isLoading: isJobLoading } = useGet(
//     `${endpoint}/job_group/${jobId}`
//   );
//   const { isOpen, onOpen, onClose } = useDisclosure();

//   const bundle_group =
//     jobGroup &&
//     jobGroup.bundle_groups &&
//     jobGroup.bundle_groups.find((bundle) => bundle.id.toString() === bundleId);
//   const bundleName = bundle_group && bundle_group.name;

//   const [updateOperations, setUpdateOperations] = useState([]);

//   return (
//     <Container maxW="7xl" className="p-5">
//       <Flex
//         direction="column"
//         gap={2}
//         alignItems="center"
//         justifyContent="center"
//       >
//         <Heading>
//           Build Operation {!isJobLoading && <>- {bundleName}</>}
//         </Heading>

//         {isStyleLoading ? (
//           <StyleSkeleton />
//         ) : (
//           <Heading size="lg">Style {itemName}</Heading>
//         )}
//         <Flex alignItems="center" gap={5}>
//           <Button
//             variant="outline"
//             colorScheme="twitter"
//             onClick={onOpen}
//             leftIcon={<IoArrowBackCircleOutline />}
//           >
//             Choose another jobs
//           </Button>
//           <Button
//             as="a"
//             href={`/${listId}/job_group/${jobId}/${bundleId}/your_list`}
//             colorScheme="twitter"
//             rightIcon={<IoCheckmarkCircleOutline />}
//           >
//             Complete
//           </Button>
//         </Flex>
//       </Flex>
//       <SimpleGrid columns={3} spacing={5} my={10}>
//         <GridItem colSpan={1}>
//           <OperationLib
//             bundleId={bundleId}
//             listId={listId}
//             setUpdateFunc={setUpdateOperations}
//           />
//         </GridItem>
//         <GridItem colSpan={2}>
//           <OperationList
//             bundleId={bundleId}
//             listId={listId}
//             updateOperationList={updateOperations}
//           />
//         </GridItem>
//       </SimpleGrid>
//       <JobDrawer
//         onClose={onClose}
//         isOpen={isOpen}
//         styleNum={itemName}
//         listId={listId}
//       />
//     </Container>
//   );
// }
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import useGet from "../customed_hook/getData";
import OperationLibList from "./OperationLib";
import OperationList from "./OperationList";
import endpoint from "../utils/endpoint";

export default function Operation() {
  const { listId, jobId, bundleId } = useParams();
  const styleNum = useGet(`${endpoint}/collection/${listId}`);
  const itemName = styleNum && styleNum.item && styleNum.item.name;

  const jobGroup = useGet(`${endpoint}/job_group/${jobId}`);
  const bundle_group = jobGroup?.bundle_groups?.find(bundle => bundle.id.toString() === bundleId);
  const bundleName = bundle_group?.name ?? 'Loading...';
  const [operationList, setOperationList] = useState([]);

  const updateOperationLists = (newOperation) => {
    setOperationList((prevOperationList) => {
      const tempOperation = {
        ...newOperation,
        id: newOperation.id || `temp-${Date.now()}`,
      }
  
      return [...prevOperationList, tempOperation]
    });
  };
  
  return (
    <div className="p-5">
      <div className="flex flex-col space-y-2 items-center justify-center">
        <h1 className="font-bold">Build Operation - {bundleName}</h1>
        <h3 className="font-bold">Style {itemName}</h3>
        <div className="space-x-5">
          <Link to={`/${listId}/job_group`}>
            <Button variant="outline-secondary">Back to Job Group</Button>
          </Link>
          <Link to={`/${listId}/job_group/${jobId}/${bundleId}/your_list`}>
            <Button>Complete</Button>
          </Link>
        </div>
      </div>
      <div className="container text-center my-5">
        <div className="row">
          <div className="col">
            <OperationLibList
              bundleGroup={bundleId}
              listId={listId}
              updateOperationLists={updateOperationLists} 
            />
          </div>
          <div className="col space-y-10">
          <OperationList
            key={operationList.length} 
            bundleGroup={bundleId}
            listId={listId}
            operationListProp={operationList}
            bundleName={bundleName}
          />
          </div>
        </div>
      </div>
    </div>
  );
}
