module.exports = {
  siteMetadata: {
    siteUrl: `https://www.yourdomain.tld`,
  },
  pathPrefix: '/notes',
  plugins: [
    {
      // Allow files in src to import other files without ../../
      resolve: `gatsby-plugin-root-import`
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Notes`,
        short_name: `Notes`,
        start_url: `/`,
        background_color: `#fdfffd`,
        theme_color: `#fdfffd`,
        display: `standalone`,
        icon: `src/images/icon.png`,
      },
    },
    {
      resolve: `gatsby-plugin-offline`,
    },
  ]
}
