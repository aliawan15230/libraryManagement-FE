import React, { useState, useEffect }                from "react";
import { Button, Table, Modal, message, Popconfirm } from 'antd';
import { fetchAllBooks, deleteBook }                 from '../../apis';
import BooksForm                                     from './BooksForm'
import LibraryListing                                from '../Library/LibraryListing';
import DeleteAlert                                   from '../generalComponents/DeleteAlert';

const BooksListing = () => {

  const [state, setState] = useState({
    loading: false,
    selectedRows: [],
    tableData: [],
    bookId: null,
    isModalOpen: false,
    showForm: false,
    mode: '',
    editId: null,
    showDelete: false,
    deleteId: null,
    page: 1,
    totalCounts: 0
  });

  useEffect(() => {
    refreshPage(1)
  }, [])

  const refreshPage = async (page) => {
    try {
      let fetchedBooks = await fetchAllBooks({ page })

      if (fetchedBooks.success) {
        setState({
          ...state,
          loading: false,
          page,
          tableData: !!fetchedBooks.data && !!fetchedBooks.data.tableData ? fetchedBooks.data.tableData : [],
          totalCounts: !!fetchedBooks.data && !!fetchedBooks.data.count ? fetchedBooks.data.count : 0,
          showForm: false,
          deleteId: null,
          showDelete: false
        })
      }
    }
    catch (err) {
      setState({ ...state, loading: false })
      console.log(err)
    }
  }

  const columns = [
    {
      title: 'Book Name',
      dataIndex: "name",
    },
    {
      title: 'Book Year',
      dataIndex: 'year',
    },
    {
      title: 'Author Name',
      dataIndex: 'author',
      render: (text, record, index) => {
        return record.authorDetail && record.authorDetail.name ? record.authorDetail.name : ""
      }
    },
    {
      title: 'Author Genre',
      dataIndex: 'genre',
      render: (text, record, index) => {
        return record.authorDetail && record.authorDetail.genre ? record.authorDetail.genre : ""
      }
    },
    {
      title: 'Show Libraries',
      key: 'library',
      fixed: 'right',
      width: 100,
      render: (text, record) => <Button type="primary" onClick={ (e) => {
        setState({ ...state, bookId: record.id, isModalOpen: true })
      } }>Show</Button>,
    },
    {
      title: 'Action',
      dataIndex: '',
      key: 'x',
      render: (text, record) => <>
        <Button type={ 'primary' } size={ 'small' }
                onClick={ () => setState({ ...state, mode: "edit", showForm: true, editId: record.id }) }>Edit</Button>
        <Button type={ 'primary' } danger size={ 'small' }
                onClick={ () => setState({ ...state, showDelete: true, deleteId: record.id }) }>Delete</Button>
      </>,
    },
  ];

  const handleModal = () => {
    setState({ ...state, showForm: !state.showForm })
  }

  const onConfirm = async () => {
    try {
      const book = await deleteBook(state.deleteId, { deleted: 1 })

      refreshPage(state.page)

    }
    catch (e) {
      console.log(e)
    }
  }

  const onCancel = async () => {
    setState({ ...state, deleteId: null, showDelete: false })
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
          Add Book
        </Button>
      </div>

      { state.showForm &&
        <BooksForm mode={ state.mode } bookId={ state.editId } showForm={ state.showForm }
                   handleModal={ handleModal } refreshPage={ refreshPage } currentPage={ state.page }/> }

      { state.showDelete && <DeleteAlert isOpen={ true } onCancel={ onCancel } onConfirm={ onConfirm }/> }

      <Table columns={ columns }
             pagination={ {
               total: state.totalCounts,
               current: state.page,
               pageSize: 10,
               onChange: handlePageChange,
             } }
             dataSource={ state.tableData && state.tableData.length > 0 ? state.tableData : [] }/>

      { state.bookId &&
        <Modal title="Book Libraries" open={ state.isModalOpen } footer={ null }
               onCancel={ () => setState({ ...state, isModalOpen: !state.isModalOpen }) }>

          <LibraryListing bookId={ state.bookId }/>
        </Modal> }

    </>
  )
}

export default BooksListing;
