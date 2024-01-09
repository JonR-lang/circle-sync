const Search = ({ searchTerm, setSearchTerm }) => {
  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <form className='rounded-lg overflow-hidden w-full shadow-md'>
      <input
        type='text'
        value={searchTerm}
        onChange={handleInputChange}
        className='w-full h-full px-3 py-1 pt-2 focus:outline-none'
        placeholder='Search user'
      />
    </form>
  );
};

export default Search;
