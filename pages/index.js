import Link from "next/link";

import Layout from "../components/MyLayout";

const PostLink = props => (
  <li>
    <Link href={`/post?title=${props.title}`}>
      <a>{props.title}</a>
    </Link>
  </li>
);

export default function Blog() {
  return (
    <div>
      <Layout>
        <h1>My Blog</h1>
        <ul>
          <PostLink title="Hello Next.js" />
          <PostLink title="Learning Next.js is awesome" />
          <PostLink title="Deploy them apps" />
        </ul>
      </Layout>
    </div>
  );
}
