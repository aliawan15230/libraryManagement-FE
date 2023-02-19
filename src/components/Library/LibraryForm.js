import React, { useState, useEffect }                     from "react";
import { Button, Modal, Input, Typography }               from 'antd';
import { addLibrary, updateLibrary, fetchLibraryDetails } from '../../apis';

const LibraryForm = ({ mode, libraryId, handleModal, showForm, currentPage, refreshPage }) => {

  const [state, setState] = useState({
    loading: false,
    libraryName: "",
    address: ""
  })

  const { Title } = Typography

  useEffect(() => {
    try {
      const anonymousFunction = async () => {

        let libraryDetails = null

        if (!!mode && mode === 'edit' && libraryId) {

          libraryDetails = await fetchLibraryDetails(libraryId)
          libraryDetails = libraryDetails.data ? libraryDetails.data : {}

        }

        setState({
          loading: false,
          libraryName: libraryDetails && libraryDetails.name ? libraryDetails.name : "",
          address: libraryDetails && libraryDetails.address ? libraryDetails.address : "",
        })

      }
      anonymousFunction()
    }
    catch (err) {
      setState({ ...state, loading: false })
      console.log(err)
    }
  }, [mode])

  const clearState = () => {
    setState({
      ...state,
      loading: false,
      libraryName: "",
      address: "",
    })
  }

  const postLibrary = async () => {

    try {

      const data = {
        name: state.libraryName,
        address: state.address ? state.address : null,
      }

      const result = await addLibrary(data)
      refreshPage(currentPage)
      clearState()
    }
    catch (e) {
      console.log(e.message)
    }

  }

  const updateLib = async () => {

    try {
      const data = {
        id: libraryId,
        name: state.libraryName,
        address: state.address ? state.address : null
      }

      const result = await updateLibrary(data)

      refreshPage(currentPage)

      clearState()

    }

    catch (e) {
      console.log(e.message)
    }

  }

  return (

    <>
      <Modal title={ mode === 'edit' ? "Edit Library" : "Add Library" } open={ !!showForm }
             onCancel={ () => handleModal() } footer={ null }>

        <Title level={ 4 }>Enter Library<b style={ { color: "red" } }>*</b></Title>
        <Input placeholder={ "Library Name" } value={ state.libraryName } onChange={ (e) => {
          setState({ ...state, libraryName: e.target.value })
        } }/>

        <Title level={ 4 }>Enter Address</Title>
        <Input placeholder="Address" value={ state.address } onChange={ (e) => {
          setState({ ...state, address: e.target.value })
        } }/>

        <div style={ { marginTop: "10px", display: 'flex', justifyContent: 'end' } }>
          <Button type="primary" onClick={ () => handleModal() } style={ { marginRight: "10px" } }>
            Cancel
          </Button>

          <Button type="primary" disabled={ !state.libraryName } onClick={ () => {
            mode === 'edit' ? updateLib() : postLibrary()
          } }>
            { mode === 'edit' ? 'Edit' : 'Add' }
          </Button>
        </div>


      </Modal>
    </>

  )
}

export default LibraryForm;
