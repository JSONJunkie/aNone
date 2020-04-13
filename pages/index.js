import Link from "next/link";

import Layout from "../components/MyLayout";

const PostLink = props => (
  <li>
    <Link href="/p/[id]" as={`/p/${props.id}`}>
      <a>{props.id}</a>
    </Link>
  </li>
);

export default function Blog() {
  return (
    <div>
      <Layout>
        <h1>My Blog</h1>
        <ul>
          <PostLink id="Hello Next.js" />
          <PostLink id="Learning Next.js is awesome" />
          <PostLink id="Deploy them apps" />
        </ul>
      </Layout>
    </div>
  );
}
