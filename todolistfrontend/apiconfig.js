const config = {
    backendUrl: process.env.NODE_ENV === 'production'
      ? 'https://todosbackend-thealkennist5301-rtts62wp.leapcell.dev'
      : 'http://localhost:8080',
  };
  
  export default config;
  