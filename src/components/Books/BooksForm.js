import dayjs                                                                                from 'dayjs';
import moment                                                                               from 'moment';
import React, { useState, useEffect }                                                       from "react";
import { Button, Modal, Input, Select, DatePicker, Typography }                             from 'antd';
import { fetchAllAuthors, fetchAllLibraries, addBook, fetchBookDetails, updateBookDetails } from '../../apis';

const BooksForm = ({ mode, bookId, handleModal, showForm, refreshPage, currentPage }) => {

  const { Option } = Select;

  const { Title } = Typography;

  const [state, setState] = useState({
    searchedString: "",
    authorOptions: [],
    authorPage: 1,
    libraryPage: 1,
    loading: false,
    selectedDate: "2019",
    libraryOptions: [],
    librarySelectLoading: false,
    selectedAuthor: null,
    selectedLibrary: [],
    bookName: "",
  })

  useEffect(() => {

    try {

      const anonymousFunction = async () => {

        setState({ ...state, loading: true, librarySelectLoading: true })

        let libraries = await fetchAllLibraries({ page: 1 })

        let authors = await fetchAllAuthors({ page: 1 })

        let bookDetails = null

        let selectedLibrary = []

        if (!!mode && mode === 'edit' && bookId) {
          bookDetails = await fetchBookDetails(bookId)
          bookDetails = bookDetails.data ? bookDetails.data : {}

          if (bookDetails.libraryDetails && bookDetails.libraryDetails.length > 0) {

            bookDetails.libraryDetails.forEach(elem => {
              selectedLibrary.push({ key: elem.id, value: elem.name })

            })
          }
        }

        setState({
          ...state,
          loading: false,
          librarySelectLoading: false,
          libraryOptions: !!libraries.data && !!libraries.data.tableData ? libraries.data.tableData : [],
          authorOptions: !!authors.data && !!authors.data.tableData ? authors.data.tableData : [],
          bookName: bookDetails && bookDetails.name ? bookDetails.name : "",
          selectedAuthor: bookDetails && bookDetails.authorDetail ? {
            key: bookDetails.authorDetail.id,
            value: bookDetails.authorDetail.name
          } : null,
          selectedLibrary,
          selectedDate: bookDetails && bookDetails.year ? bookDetails.year : null
        })

      }
      anonymousFunction()


    }
    catch (err) {
      setState({ ...state, loading: false, librarySelectLoading: false })
      console.log(err)
    }
  }, [mode])

  const clearState = () => {
    setState({
      ...state,
      searchedString: "",
      selectedDate: null,
      selectedLibrary: [],
      selectedAuthor: null,
      bookName: "",
      loading: false
    })
  }

  function handleDateChange(date, dateString) {
    setState({ ...state, selectedDate: dateString });
  }

  const fetchAuthors = async (page) => {

    let fetchedAuthors = await fetchAllAuthors({ page })

    if (fetchedAuthors.success) {
      setState({
        ...state,
        authorPage: page,
        loading: false,
        authorOptions: !!fetchedAuthors.data ? [...state.authorOptions, ...fetchedAuthors.data.tableData] : []
      })
    }

  }

  const fetchLibraries = async (page) => {

    let fetchedLibrary = await fetchAllLibraries({ page })

    if (fetchedLibrary.success) {
      setState({
        ...state,
        libraryPage: page,
        librarySelectLoading: false,
        libraryOptions: !!fetchedLibrary.data ? [...state.libraryOptions, ...fetchedLibrary.data.tableData] : [],
      })
    }

  }

  const postBook = async () => {

    try {
      const data = {
        name: state.bookName,
        year: state.selectedDate ? state.selectedDate : null,
        author_id: state.selectedAuthor && state.selectedAuthor.key ? state.selectedAuthor.key : null,
        library: state.selectedLibrary.length > 0 ? state.selectedLibrary.map(elem => elem.key) : []
      }

      const result = await addBook(data)


      clearState()
      refreshPage(currentPage)


    }
    catch (e) {
      console.log(e.message)
    }

  }

  const updateBook = async () => {

    try {

      const data = {
        id: bookId,
        name: state.bookName,
        year: state.selectedDate ? state.selectedDate : null,
        author_id: state.selectedAuthor.key,
        library: state.selectedLibrary.map(elem => elem.key)
      }

      const result = await updateBookDetails(data)

      clearState()
      refreshPage(currentPage)
    }

    catch (e) {
      console.log(e.message)
    }

  }

  const handlePopupScroll = (e, mode) => {
    const { scrollTop, clientHeight, scrollHeight } = e.target;
    if (scrollTop + clientHeight === scrollHeight) {

      if (!!mode) {
        if (mode === 'library') {
          setState({ ...state, librarySelectLoading: true })
          fetchLibraries(state.libraryPage + 1)
        }
        else {
          setState({ ...state, loading: true })
          fetchAuthors(state.authorPage + 1)
        }
      }
    }
  };

  const getOptionLabel = (option) => `${ option }`;

  const checkDisabled = () => {
    if (!!state.bookName && !!state.selectedDate) {
      return false
    }
    return true
  }

  const getSelectedDateFormat = (date) => {
    const today = date;
    return today.getFullYear().toString()

  }

  const dateFormat = 'YYYY';

  return (

    <>
      <Modal title={ mode === 'edit' ? "Edit Book Details" : "Add Book Details" } open={ !!showForm }
             footer={ null }
             onCancel={ () => handleModal() }>

        <Title level={ 4 }>Enter Book Name<b style={ { color: "red" } }>*</b></Title>
        <Input placeholder="Book Name" value={ state.bookName } onChange={ (e) => {
          setState({ ...state, bookName: e.target.value })
        } }/>

        <Title level={ 4 }>Select Book Year<b style={ { color: "red" } }>*</b></Title>
        <DatePicker
          value={ dayjs(!!state.selectedDate ? state.selectedDate.toString() : getSelectedDateFormat(new Date()), dateFormat) }
          onChange={ handleDateChange }
          // value={ state.selectedDate ? state.selectedDate : moment() }
          picker="year"
          format={ dateFormat }
          placeholder={ 'Select Book Year' }
        />

        <Title level={ 4 }>Select Author</Title>
        <Select
          showSearch
          value={ state.selectedAuthor }
          onPopupScroll={ (e) => handlePopupScroll(e, 'author') }
          style={ { width: "100%" } }
          onChange={ (e, option) => setState({ ...state, selectedAuthor: option }) }
        >
          { (state.authorOptions && state.authorOptions.length > 0) && state.authorOptions.map((option) => (
            <Option key={ option.id } value={ option.name } loading={ state.loading }>
              { getOptionLabel(option.name) }
            </Option>
          )) }
        </Select>

        <Title level={ 4 }>Select Library</Title>
        <Select
          showSearch
          mode={ "multiple" }
          value={ state.selectedLibrary }
          onPopupScroll={ (e) => handlePopupScroll(e, 'library') }
          optionLabelProp="value"
          style={ { width: "100%" } }
          onChange={ (e, option) => {
            setState({ ...state, selectedLibrary: option })
          } }
        >
          { (state.libraryOptions && state.libraryOptions.length > 0) && state.libraryOptions.map((option) => (
            <Option key={ option.id } value={ option.name } loading={ state.librarySelectLoading }>
              { getOptionLabel(option.name) }
            </Option>
          )) }
        </Select>


        <div style={ { marginTop: "10px", display: 'flex', justifyContent: 'end' } }>
          <Button type="primary" onClick={ () => handleModal() } style={ { marginRight: "10px" } }>
            Cancel
          </Button>

          <Button type="primary" disabled={ checkDisabled() } onClick={ () => {
            mode === 'edit' ? updateBook() : postBook()
          } }>
            { mode === 'edit' ? 'Edit' : 'Add' }
          </Button>
        </div>

      </Modal>
    </>

  )
}

export default BooksForm;
