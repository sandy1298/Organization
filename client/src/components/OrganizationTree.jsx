import React from "react";
import { Tree, TreeNode } from "react-organizational-chart";
import styled from "styled-components";


const StyledNode = styled.div`
  background: rgb(149, 236, 235);
  padding-right : 20px;
  display: inline-flex;
  align-items: center;
  height: 63px;
  text-align: center;
  color: black;
  font-family: Arial, sans-serif;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  border: 1px solid rgb(149, 236, 235);
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
`;

const ImageContainer = styled.div`
  width: 65px;
  height: 65px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  margin-left: -10px;
  border: 2px solid white;
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
   text-align: left;
`;

const TextContainer = styled.div`
  text-align: center;
`;

const Name = styled.p`
  margin: 0;
  font-size: 14px;
  font-weight: bold;
`;

const Designation = styled.p`
  margin: 0;
  font-size: 12px;
   text-align: center;
`;

const Divider = styled.hr`
  width: 100%;
  border: 0;
  height: 1.8px;
  background: black;
  margin: 1px 0;
`;

const OrganizationTree = ({ employees }) => {

  // Find the root employee (top-level manager)
  const rootEmployee = employees?.find(emp => !emp.reportingManager);

  // Function to render tree nodes, excluding the root employee
  const renderTree = (managerId) => {
    return employees
      .filter(emp => emp.reportingManager?._id === managerId)
      .map(emp => (
        <TreeNode
          label={
            <StyledNode>
              <ImageContainer>
                <StyledImage src={emp.image} alt={emp.name} />
              </ImageContainer>
              <TextContainer>
                <Name>{emp.name}</Name>
                <Divider />
                <Designation>{emp.designation}</Designation>
              </TextContainer>
            </StyledNode>
          }
          key={emp._id}
        >
          {renderTree(emp._id)}
        </TreeNode>
      ));
  };

  return (
    <>
      {employees && employees.length > 0 ?
        <Tree
          lineWidth={"2px"}
          lineColor={"black"}
          lineBorderRadius={"10px"}
          label={
            <StyledNode>
              <ImageContainer>
                <StyledImage src={rootEmployee.image} alt={rootEmployee.name} />
              </ImageContainer>
              <TextContainer>
                <Name>{rootEmployee.name}</Name>
                <Divider />
                <Designation>{rootEmployee.designation}</Designation>
              </TextContainer>
            </StyledNode>
          }
        >
          {renderTree(rootEmployee._id)}
        </Tree>
        :
        <p style={{ fontWeight: "bold" }}> No Employee found</p>
      }
    </>
  );
};

export default OrganizationTree;




