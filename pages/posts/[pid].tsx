import React from "react";

import Head from "next/head";
import { NextPage } from "next";

import fetch from "cross-fetch";

import Box from "@material-ui/core/Box";
import NoSsr from "@material-ui/core/NoSsr";
import Typography from "@material-ui/core/Typography";

import format from "date-fns/format";

import Layout from "../../components/layout";
import { PostData } from "../../data/post";
import { getBaseUrl } from "../../urlHelper";

type Props = PostData;

const renderDate = (timestamp: number, title: string) => (
  <NoSsr>
    <Box>
      <Typography variant="caption" color="textSecondary">
        {title + ": " + format(new Date(timestamp), "PPp")}
      </Typography>
    </Box>
  </NoSsr>
);

const Post: NextPage<Props> = ({
  createdTime,
  lastEditedTime,
  title,
  sections
}) => (
  <Layout>
    <Head>
      <title>{title}::johnwook.com</title>
    </Head>

    <Box my={3}>
      <Typography variant="h5">{title}</Typography>
    </Box>

    <Box>
      {sections.map(b => (
        <Box key={b.id} my={2}>
          <Typography variant="body2">{b.value}</Typography>
        </Box>
      ))}
      {renderDate(createdTime, "Created")}
      {renderDate(lastEditedTime, "Last edited")}
    </Box>
  </Layout>
);

Post.getInitialProps = async ({ query, req }) => {
  const { pid } = query;
  const pageId = Array.isArray(pid) ? pid[0] : pid;

  const url = getBaseUrl(req) + "/api/posts/" + pageId;

  const res = await fetch(url);

  if (res.ok) {
    return { ...(await res.json()) };
  } else {
    throw new Error("Oops");
  }
};

export default Post;
