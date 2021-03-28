/**
 * Fix: react-🔥-dom patch is not detected.
 * https://github.com/gatsbyjs/gatsby/issues/11934
 */
exports.onCreateWebpackConfig = ({ stage, actions }) => {
  if (stage.startsWith('develop')) {
    actions.setWebpackConfig({
      resolve: {
        alias: {
          'react-dom': '@hot-loader/react-dom',
        },
      },
    });
  }
};

// You can delete this file if you're not using it
const path = require('path');
const docPageTemplate = path.resolve('src/templates/docPage.tsx');
const frontPageTemplate = path.resolve('src/templates/frontpage.tsx');
const sideBar = require('./config/sidebar.json');

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  const result = await graphql(`
    query {
      allMarkdownRemark {
        edges {
          node {
            id
            frontmatter {
              title
              id
            }
            html
            fileAbsolutePath
          }
        }
      }
    }
  `);

  const posts = result.data.allMarkdownRemark.edges;
  const idTitleMap = {};
  const languages = [];

  // create documentation pages
  posts.forEach(({ node }) => {
    console.log('-node.fileAbsolutePath-', node.frontmatter);
    const parsedPath = path.parse(node.fileAbsolutePath);
    const id = node.id;
    const markDownId = node.frontmatter.id;
    const name = parsedPath.name;
    const title = node.frontmatter.title;
    const lng = parsedPath.dir.match('translated_docs') ? parsedPath.dir.split('/').pop() : 'en';
    if (!languages.includes(lng)) {
      languages.push(lng);
    }

    if (!idTitleMap[lng]) {
      idTitleMap[lng] = {};
    }

    idTitleMap[lng][markDownId] = title;

    createPage({
      path: `docs/${lng}/${name}.html`,
      component: docPageTemplate,
      context: { id, lng, sideBar, title, idTitleMap, markDownId },
    });
  });

  // create index pages
  languages.map((language) => {
    createPage({
      path: language === 'en' ? '/' : `/${language}/index.html`,
      component: frontPageTemplate,
      context: { id: '', lng: language, sideBar, title: '', idTitleMap, markDownId: '/' },
    });
  });
};
