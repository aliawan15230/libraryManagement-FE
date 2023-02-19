import moment                         from 'moment';
import React, { useState, useEffect } from "react"
import { fetchAllAuthors }            from '../../apis'
import { Table, Button, Pagination }  from 'antd';
import AuthorForm                     from './AuthorForm';

const AuthorListing = () => {

  const [state, setState] = useState({
    loading: false,
    tableData: [],
    mode: "",
    showForm: false,
    editId: "",
    page: 1,
    totalCount: 0
  });

  const refreshPage = async (page) => {
    try {
      let fetchedBooks = await fetchAllAuthors({ page })

      if (fetchedBooks.success) {
        setState({
          ...state,
          page,
          showForm: false,
          loading: false,
          tableData: !!fetchedBooks.data && fetchedBooks.data.tableData ? fetchedBooks.data.tableData : [],
          totalCount: !!fetchedBooks.data && fetchedBooks.data.count ? fetchedBooks.data.count : 0,
        })
      }

    }
    catch (err) {
      setState({ ...state, loading: false, showForm: false })
    }
  }

  useEffect(() => {
    refreshPage(1)
  }, [])

  const columns = [
    {
      title: 'Author Name',
      dataIndex: "name",
    },
    {
      title: 'DOB',
      dataIndex: 'birth_date',
      render: (e, option) => {
        return !!option && option.birth_date ? moment(option.birth_date).format('YYYY-MM-DD') : "no date"
      }
    },
    {
      title: 'Genre',
      dataIndex: 'genre',
    },
    {
      title: 'Action',
      dataIndex: '',
      key: 'x',
      render: (text, record) => <>
        <Button type={ 'primary' } size={ 'small' }
                onClick={ () => setState({ ...state, mode: "edit", showForm: true, editId: record.id }) }>Edit</Button>
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
          Add Author
        </Button>
      </div>

      { state.showForm &&
        <AuthorForm mode={ state.mode } authorId={ state.editId } showForm={ state.showForm }
                    handleModal={ handleModal } refreshPage={ refreshPage } currentPage={ state.page }/> }

      <Table
        columns={ columns }
        pagination={ {
          total: state.totalCount,
          current: state.page,
          pageSize: 10,
          onChange: handlePageChange,
        } }
        dataSource={ state.tableData && state.tableData.length > 0 ? state.tableData : [] }/>
    </>
  )
}

export default AuthorListing;
