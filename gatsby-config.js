const path = require("path")
const fs = require("fs")

module.exports = {
  siteMetadata: {
    siteUrl: `https://www.yourdomain.tld`,
  },
  pathPrefix: '/docs',
  plugins: [
    {
      resolve: `gatsby-plugin-root-import`
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `GatsbyJS`,
        short_name: `GatsbyJS`,
        start_url: `/`,
        background_color: `#fafffa`,
        theme_color: `#fafffa`,
        display: `standalone`,
        icon: `src/images/icon.png`,
      },
    },
    {
      resolve: `gatsby-plugin-offline`,
    },
  ]
}
