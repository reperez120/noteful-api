module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DB_URL: process.env.DATABASE_URL || 'postgresql://rachelemilyperez@localhost/noteful',
    API_BASE_URL: process.env.REACT_APP_API_BASE_URL || "https://noteful-app.reperez120.now.sh/" || 'http://localhost3000'

}
  