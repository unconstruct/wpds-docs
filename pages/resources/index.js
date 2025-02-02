import React from "react";
import { NextSeo } from "next-seo";
import { getDocsListBySection, getNavigation } from "~/services";
import { Box, Icon, theme, styled } from "@washingtonpost/wpds-ui-kit";
import ChevronRight from "@washingtonpost/wpds-assets/asset/chevron-right";
import { Header } from "~/components/Markdown/Components/headers";
import Link from "~/components/Markdown/Components/link";
import { P } from "~/components/Markdown/Styling";

const Masonry = styled("section", {
  width: "100%",
  display: "grid",
  gridTemplateColumns: "repeat( auto-fit, minmax(250px, 1fr) )",
  gridGap: "$100",
  "@sm": {
    gridTemplateColumns: "1fr",
  },
});

// create a divider
const Divider = styled("hr", {
  gridColumnEnd: "span 2",
  margin: "$100 0 $050",
  padding: 0,
  border: 0,
  height: "1px",
  backgroundColor: "$subtle",
});

const CheveronForLink = styled(ChevronRight, {
  fill: theme.colors.accessible,
});

export default function Page({ collections }) {
  return (
    <>
      <NextSeo title={`WPDS - Resources`} />
      <header>
        <Header as="h1">Resources</Header>
      </header>

      <Divider aria-hidden={false} />

      {collections.map((collection, index) => {
        return (
          <Box
            key={index}
            css={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Link href={`/resources/${collection.kicker.toLowerCase()}`}>
              <Header
                as="h2"
                css={{
                  marginBottom: "$050",
                }}
              >
                {collection.kicker}
              </Header>
            </Link>
            <Masonry key={index}>
              {collection.docs.map((doc) => {
                return (
                  <Link
                    href={doc.slug}
                    key={doc.slug}
                    css={{
                      border: "1px solid $subtle",
                      borderRadius: "$025",
                      padding: "$100",
                    }}
                  >
                    <article>
                      {doc.data.publishDate}
                      <Header as="h3">{doc.data.title}</Header>

                      <P
                        css={{
                          marginBottom: "$100",
                        }}
                      >
                        {doc.data.description}
                      </P>
                      <Box
                        as="footer"
                        css={{
                          fontFamily: "$meta",
                          fontSize: "$100",
                          fontWeight: "$light",
                          lineHeight: "$125",
                        }}
                      >
                        {doc.data.byline}
                      </Box>
                    </article>
                  </Link>
                );
              })}
            </Masonry>
            <Link href={`/resources/${collection.kicker.toLowerCase()}`}>
              <Header
                as="h4"
                css={{
                  display: "flex",
                  marginTop: "$100",
                  alignItems: "center",
                  lineHeight: "$100",
                }}
              >
                <span>See all entries</span>
                <Icon>
                  <CheveronForLink />
                </Icon>
              </Header>
            </Link>
            <Box
              css={{
                marginBottom: "$200",
              }}
              aria-hidden={false}
            />
          </Box>
        );
      })}
    </>
  );
}

export const getStaticProps = async ({ params }) => {
  const docs = await getDocsListBySection("resources");

  // sort docs into collections by doc.data.kicker property
  const collections = [
    // create a collection for each doc.data.kicker property and put their docs in it
    ...docs.reduce((acc, doc) => {
      const kicker = doc.data.kicker;
      const collection = acc.find((collection) => collection.kicker === kicker);
      const todaysDate = new Date();
      // exclude future posts using collection.publishDate
      if (new Date(doc.data.publishDate) <= todaysDate) {
        if (collection) {
          collection.docs.push(doc);
        } else {
          acc.push({
            kicker,
            docs: [doc],
          });
        }
      }
      return acc;
    }, []),
  ].sort((a, b) => {
    // alpha sort
    return a.kicker.localeCompare(b.kicker);
  });

  const navigation = await getNavigation();

  return {
    props: {
      collections,
      navigation,
    },
  };
};
