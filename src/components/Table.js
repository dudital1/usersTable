import React, { useEffect, useState } from "react";
import { Avatar, Link } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";

const ROW_COUNT = 5000; // api users length

export default function Table() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]); // holds the current users
  const [page, setPage] = useState(1); // holds the current page (in order to query the api's server)

  useEffect(() => {
    fetch(`https://randomuser.me/api/?page=${page}&results=10&seed=dudiTal`) // inserting the page into the api url
      .then((res) => res.json())
      .then((data) => {
        const usersData = [];
        data.results.forEach((user) => {
          const { name, picture, email, gender, dob, login } = user; // destructing the wanted properties from the raw user data
          const userObject = {
            // holds the required information for each user
            fullName: `${name.first} ${name.last}`,
            age: dob.age,
            id: email,
            picture: picture.thumbnail,
            gender: gender,
            username: login.username,
          };
          usersData.push(userObject);
        });
        
        // sort the array based on fullName (strings comparison)
        usersData.sort((a, b) => {
          const name = a.fullName,
            secondName = b.fullName;
          if (name < secondName) return -1;
          if (secondName > name) return 1;
          return 0;
        });
        setUsers(usersData); // set users to the new processed and sorted array
      });
  }, [page]); // fire every time page changes..

  // styles for the whole tables
  const tableStyles = {
    width: "80%",
    margin: "auto",
    minWidth: "400px",
    maxWidth: "1200px",
    backgroundColor: "#FBF8F8",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
  };
  
  // holds all the columns headers
  const columns = [
    {
      field: "picture",
      headerName: "Picture",
      renderCell: (params) => {
        // function that re-renders the layout of the cell
        // link to the users page
        return (
          <Avatar src={params.value} />
        );
      },
      flex: 1, // flex property to distribute the width of the columns
      filterable: false,
      sortable: false,
      cellClassName: "grid--column",
    },
    {
      field: "fullName",
      headerName: "Full Name",
      flex: 2,
      cellClassName: "grid--column",
    },
    { field: "age", headerName: "Age", flex: 1, cellClassName: "grid--column" },
    {
      field: "gender",
      headerName: "Gender",
      flex: 1,
      filterable: false,
      cellClassName: "grid--column",
    },
    {
      field: "id",
      headerName: "Email",
      flex: 4,
      // change the email to link and used mailto in order to pop up the send email screen
      renderCell: (params) => {
        return (
          <Link
            href={`mailto:${params.value}`}
            style={{ textDecoration: "none", color: "#983732" }}
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <div>{params.value}</div>
          </Link>
        );
      },
    },
  ];
  
  //  newPage is given by 'onPageChange'
  function handlePageUp(newPage) {
    setPage(++newPage); //datagrid pages are 0 based, and api calls are "1 based"
  }

  function redirectToUserPage(GridRowParams) {
    const username = GridRowParams.row.username; // in order to match the url params
    navigate(`/users/${username}/${page}`);
  }

  return (
    <div style={tableStyles}>
      <h1 style={{ margin: "auto", padding: "20px 0px" }}>All Users</h1>
      <DataGrid
        autoHeight={true}         // handle table height tom match number of rows
        rows={users}              // initialize rows to users(handled by state)
        columns={columns}         // hard coded columns
        pageSize={10}             // how many pages in each page
        rowsPerPageOptions={[10]} // array with options for the user to choose from
                                  // (had a warning without this prop)
        disableColumnSelector     // remove selection functionality from columns header menu
                                  // (three dots on the right hand side of each header)
        disableSelectionOnClick   // disable select row (no need to...)
        paginationMode="server"   // manualy handle pagination functionality
        rowCount={ROW_COUNT}      // max rows declared on the top of the file
        onPageChange={handlePageUp} // function that updated the page
        onRowClick={redirectToUserPage}
      />
    </div>
  );
}
