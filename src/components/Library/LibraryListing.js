import React, { useState, useEffect }                           from 'react';
import { Button, Table }                                        from 'antd';
import { fetchBookLibraries, fetchAllLibraries, fetchAllBooks } from '../../apis';
import LibraryForm                                              from './LibraryForm';

const LibraryListing = ({ bookId }) => {

  const [state, setState] = useState({
    loading: false,
    tableData: [],
    showForm: false,
    mode: "",
    editId: "",
    page: 1,
    totalCounts: 0
  });

  const refreshPage = async (page) => {
    try {
      if (bookId) {

        let fetchedBooks = await fetchBookLibraries({ bookId, page })

        if (fetchedBooks.success) {

          let tableData = []

          if (fetchedBooks.data && fetchedBooks.data.length > 0) {
            fetchedBooks.data.forEach(elem => {
              if (elem.details && elem.details.length > 0) {
                tableData = elem.details
              }
            })
          }

          setState({
            ...state,
            loading: false,
            page,
            tableData: tableData,
            totalCounts: tableData.length,
            showForm: false
          })
        }
      }
      else {
        let fetchedBooks = await fetchAllLibraries({ page })
        if (fetchedBooks.success) {
          setState({
            ...state,
            loading: false,
            page,
            tableData: !!fetchedBooks.data && !!fetchedBooks.data.tableData ? fetchedBooks.data.tableData : [],
            totalCounts: !!fetchedBooks.data && !!fetchedBooks.data.counts ? fetchedBooks.data.counts : 0,
            showForm: false
          })
        }
      }
    }
    catch (err) {
      setState({ ...state, loading: false })
    }
  }

  useEffect(() => {
    refreshPage(1)
  }, [bookId])

  const columns = [
    {
      title: 'Library Name',
      dataIndex: "name",
    },
    {
      title: 'Address',
      dataIndex: 'address',
    },
    {
      title: 'Action',
      dataIndex: '',
      key: 'x',
      render: (text, record) => <>
        <Button type={ 'primary' } size={ 'small' }
                onClick={ () => {
                  setState({ ...state, mode: "edit", showForm: true, editId: record.id })
                } }>Edit</Button>
      </>,
    },

  ];

  const handleModal = () => {
    setState({ ...state, showForm: !state.showForm })
  }

  const handlePageChange = (page) => {
    refreshPage(page)
  }

  return (
    <>
      <div
        style={ {
          marginBottom: 16,
        } }
      >
        <span
          style={ {
            marginLeft: 8,
          } }
        >
          { state.selectedRows && state.selectedRows.length > 0 ? `Selected ${ state.selectedRows.length } items` : '' }
        </span>
      </div>

      <div style={ { display: "flex", justifyContent: "end", marginBottom: "10px" } }>
        <Button type="primary" onClick={ () => setState({ ...state, mode: "add", showForm: true }) }>
          Add Library
        </Button>
      </div>

      { state.showForm &&
        <LibraryForm mode={ state.mode } libraryId={ state.editId } showForm={ state.showForm }
                     handleModal={ handleModal } refreshPage={ refreshPage } currentPage={ state.page }/> }

      <Table columns={ columns }
             pagination={ {
               total: state.totalCounts,
               current: state.page,
               pageSize: 10,
               onChange: handlePageChange,
             } }
             dataSource={ state.tableData && state.tableData.length > 0 ? state.tableData : [] }/>
    </>
  )
}

export default LibraryListing;
