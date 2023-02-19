import Axios from 'axios';

export const fetchAllBooks = async (filters) => {
  try {
    const response = await Axios.get(`http://localhost:4000/books`, {
      params: { filters }
    });
    return response.data
  }
  catch (e) {
    return e;
  }
}

export const fetchAllAuthors = async (filters) => {
  try {
    const response = await Axios.get(`http://localhost:4000/author`, {
      params: { filters }
    });
    return response.data
  }
  catch (e) {
    return e;
  }
}

export const fetchAllLibraries = async (filters) => {
  try {
    const response = await Axios.get(`http://localhost:4000/library/libraries`, {
      params: { filters }
    });
    return response.data
  }
  catch (e) {
    return e;
  }
}

export const addBook = async (data) => {
  try {
    const response = await Axios.post(`http://localhost:4000/books`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data
  }
  catch (e) {
    return e;
  }
}

export const fetchBookLibraries = async ({ bookId, page }) => {
  try {
    const response = await Axios.get(`http://localhost:4000/library/bookLibraries/${ bookId }`, {
      params: { page }
    });
    return response.data
  }
  catch (e) {
    return e;
  }
}

export const fetchBookDetails = async (bookId) => {
  try {
    const response = await Axios.get(`http://localhost:4000/books/bookDetails/${ bookId }`);
    return response.data
  }
  catch (e) {
    return e;
  }
}

export const updateBookDetails = async (data) => {

  try {
    const response = await Axios.put(`http://localhost:4000/books`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data
  }
  catch (e) {
    return e;
  }
}

export const addAuthor = async (data) => {

  try {
    const response = await Axios.post(`http://localhost:4000/author`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data
  }
  catch (e) {
    return e;
  }
}

export const updateAuthor = async (data) => {
  try {
    const response = await Axios.put(`http://localhost:4000/author`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data
  }
  catch (e) {
    return e;
  }
}

export const fetchAuthorDetails = async (authorId) => {
  try {
    const response = await Axios.get(`http://localhost:4000/author/authorDetails/${ authorId }`);
    return response.data
  }
  catch (e) {
    return e;
  }
}

export const addLibrary = async (data) => {
  try {
    const response = await Axios.post(`http://localhost:4000/library`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data
  }
  catch (e) {
    return e;
  }
}

export const updateLibrary = async (data) => {
  try {
    const response = await Axios.put(`http://localhost:4000/library`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data
  }
  catch (e) {
    return e;
  }
}

export const fetchLibraryDetails = async (libraryId) => {
  try {
    const response = await Axios.get(`http://localhost:4000/library/libraryDetails/${ libraryId }`);
    return response.data
  }
  catch (e) {
    return e;
  }
}

export const deleteBook = async (bookId, data) => {

  try {
    const response = await Axios.put(`http://localhost:4000/books/delete/${ bookId }`, data);
    return response.data
  }
  catch (e) {
    return e;
  }
}

