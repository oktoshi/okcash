import React from "react";
import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";

const FeatureList = [
  {
    icon: "🚀",
    title: "Multi-Agent Multichain Framework",
    description: (
      <>
        Deploy smart, autonomous AI agents 24/7 to supercharge your community and platforms—integrating seamlessly with Discord, Twitter, Telegram, and beyond. Voice, text, or media—OKai does it all.
      </>
    ),
  },
  {
    icon: "🤖",
    title: "Leading AI, Limitless Potential",
    description: (
      <>
        Powered by top AI models like GPT-4, Llama, and more, OKai delivers advanced capabilities: smart memory, rapid workflows, and seamless document handling. Future-ready tools to elevate your success.
      </>
    ),
  },
  {
    icon: "🌟",
    title: "Customizable to Your Vision",
    description: (
      <>
        Shape OKai to fit your needs with its modular, plugin-friendly design. Extend, connect, and innovate—fully powered by TypeScript. Your tools, your way, your future.
      </>
    ),
  },
];

function Feature({ icon, title, description }) {
  return (
    <div className={clsx("col")}>
      <div
        className="margin--md"
        style={{
          height: "100%",
        }}
      >
        <div className="card__body text--left padding--md">
          <icon className={styles.featureIcon}>{icon}</icon>
          <Heading
            as="h3"
            style={{
              color: "var(--ifm-heading-color)",
            }}
          >
            {title}
          </Heading>
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          <div className={styles.featureGrid}>
            {FeatureList.map((props, idx) => (
              <Feature key={idx} {...props} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
