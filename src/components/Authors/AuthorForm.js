import React, { useState, useEffect }                   from "react";
import { Button, Modal, Input, Typography, DatePicker } from 'antd';
import { updateAuthor, addAuthor, fetchAuthorDetails }  from '../../apis';
import dayjs                                            from 'dayjs'

const AuthorForm = ({ mode, authorId, handleModal, showForm, refreshPage, currentPage }) => {

  const [state, setState] = useState({
    loading: false,
    selectedDate: null,
    authorName: "",
    genre: "",
    disabled: true
  })

  const { Title } = Typography

  useEffect(() => {
    try {
      const anonymousFunction = async () => {

        let authorDetails = null

        if (!!mode && mode === 'edit' && authorId) {

          authorDetails = await fetchAuthorDetails(authorId)
          authorDetails = authorDetails.data ? authorDetails.data : {}

        }

        const selectedDate = !!authorDetails && authorDetails.birth_date ? getSelectedDateFormat(new Date(authorDetails.birth_date)) : null

        setState({
          loading: false,
          authorName: authorDetails && authorDetails.name ? authorDetails.name : "",
          selectedDate: selectedDate,
          genre: authorDetails && authorDetails.genre ? authorDetails.genre : "",
        })

      }
      anonymousFunction()
    }
    catch (err) {
      setState({ ...state, loading: false, librarySelectLoading: false })
      console.log(err)
    }
  }, [mode])

  function handleDateChange(date, dateString) {

    setState({ ...state, selectedDate: dateString });
  }

  const getSelectedDateFormat = (date) => {
    const today = date;
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const day = ('0' + today.getDate()).slice(-2);
    const currentDate = `${ year }/${ month }/${ day }`;

    return currentDate

  }

  const clearState = () => {
    setState({
      ...state,
      selectedDate: null,
      authorName: "",
      genre: "",
      loading: false
    })
  }

  const postAuthor = async () => {

    try {

      const data = {
        name: state.authorName,
        birth_date: state.selectedDate ? state.selectedDate : null,
        genre: state.genre ? state.genre : null
      }

      const result = await addAuthor(data)

      if (result.success) {
        clearState()
        refreshPage(currentPage)
      }

    }
    catch (e) {
      console.log(e.message)
    }

  }

  const updateAuth = async () => {

    try {
      const data = {
        id: authorId,
        name: state.authorName,
        birth_date: state.selectedDate ? state.selectedDate : null,
        genre: state.genre ? state.genre : null
      }

      const result = await updateAuthor(data)

      clearState()
      refreshPage(currentPage)
    }
    catch (e) {
      console.log(e.message)
    }

  }

  const dateFormat = 'YYYY/MM/DD';

  return (

    <>
      <Modal title={ mode === 'edit' ? "Edit Author" : "Add Author" } open={ !!showForm }
             footer={ null }
             onCancel={ () => handleModal() }>

        <Title level={ 4 }>Enter Author Name<b style={ { color: "red" } }>*</b></Title>
        <Input placeholder={ "Author Name" } value={ state.authorName } onChange={ (e) => {
          setState({ ...state, authorName: e.target.value })
        } }/>

        <Title level={ 4 }>Enter Author Genre</Title>
        <Input placeholder="Genre" value={ state.genre } onChange={ (e) => {
          setState({ ...state, genre: e.target.value })
        } }/>

        <Title level={ 4 }>Select DOB</Title>
        <DatePicker
          onChange={ handleDateChange }
          value={ dayjs(state.selectedDate ? state.selectedDate : getSelectedDateFormat(new Date()), dateFormat) }
          format={ dateFormat }/>

        <div style={ { marginTop: "10px", display: 'flex', justifyContent: 'end' } }>
          <Button type="primary" onClick={ () => handleModal() } style={ { marginRight: "10px" } }>
            Cancel
          </Button>

          <Button type="primary" disabled={ !state.authorName } onClick={ () => {
            mode === 'edit' ? updateAuth() : postAuthor()
          } }>
            { mode === 'edit' ? 'Edit' : 'Add' }
          </Button>
        </div>


      </Modal>
    </>

  )
}

export default AuthorForm;
