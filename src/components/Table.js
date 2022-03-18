import React, { useEffect, useState } from "react";
import { Avatar, Link } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const ROW_COUNT = 5000;                                 // api users length

export default function Table() {   

  const [users, setUsers] = useState([]);               // holds the current users  
  const [page , setPage] = useState(1);                 // holds the current page (in order to query the api's server)

  useEffect(() => {
    fetch(`https://randomuser.me/api/?page=${page}&results=10&seed=abc`)    // inserting the page into the api url   
      .then((res) => res.json())
      .then((data) => {
        const usersData = [];
        data.results.forEach((user) => {
          const { name, picture, email, gender, dob } = user;       // destructing the wanted properties from the raw user data 
          const userObject = {                                      // holds the required information for each user
            fullName: `${name.first} ${name.last}`,
            age: dob.age,
            id: email,
            picture: picture.thumbnail,
            gender: gender,
          };
          usersData.push(userObject);
        });
        usersData.sort((a, b) => {          // sort the array based on fullName (strings comparison)
          const name = a.fullName,
            secondName = b.fullName;
          if (name < secondName) 
            return -1;
          if (secondName > name) 
            return 1;
          return 0;
        });
        setUsers(usersData);                // set users to the new processed and sorted array
      });
  }, [page]);                               // fire every time page changes..

  const tableStyles = {                          // styles for the whole tables
    width: "80%",
    margin: "auto",
    minWidth: "600px",
    maxWidth: "1200px",
    backgroundColor: "#FBF8F8",
    borderRadius: "10px",
  };

  const columns = [                         // holds all the columns headers
    {
      field: "picture",
      headerName: "Picture",
      renderCell: (params) => {             // function that renders the layout of the cell
        return (                            // link to the users page
          <Link href="">                    
            <Avatar src={params.value} /> 
          </Link>
        );
      },
      flex: 1,                              // flex property to distribute the width of the columns 
    },
    { field: "fullName", headerName: "Full Name", flex: 2 },
    { field: "age", headerName: "Age", flex: 1 },
    { field: "gender", headerName: "Gender", flex: 1 },
    {
      field: "id",
      headerName: "Email",
      flex: 4,
      renderCell: (params) => {             // change the email to link and used mailto in order to pop up the send email screen
        return (
          <Link
            href={`mailto:${params.value}`}
            style={{ textDecoration: "none", color: "#983732" }}
          >
            <div>{params.value}</div>
          </Link>
        );
      },
    },
  ];

  function handlePageUp(newPage){
      setPage(++newPage);                   //datagrid pages are 0 based, and api calls are "1 based" () 
  }

  return (
    <div style={tableStyles}>
      <DataGrid
        autoHeight={true}                   // handle table height tom match number of rows   
        rows={users}                        // initialize rows to users(handled by state)
        columns={columns}                   // hard coded columns
        pageSize={10}                       // how many pages in each page
        rowsPerPageOptions={[10]}           // array with options for the user to choose from 
                                            // (had a warning without this prop)
        disableColumnSelector               // remove selection functionality from columns header menu 
                                            // (three dots on the right hand side of each header)
        disableSelectionOnClick             // disable select row (no need to...)
        paginationMode="server"             // manualy handle pagination functionality 
        rowCount={ROW_COUNT}                // max rows declared on the top of the file
        onPageChange={handlePageUp}         // function that updated the page
        // loading={true}
      />
    </div>
  );
}
