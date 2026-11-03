function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero__content">
        <p className="eyebrow">COMFORT MEETS CRAFT</p>

        <h1>
          Make room for
          <br />
          <em>better living.</em>
        </h1>

        <p className="hero__description">
          Thoughtfully designed furniture for the moments that make a house
          feel like home.
        </p>

        <a className="hero__button" href="#shop-categories-title">
          Explore categories <span>↗</span>
        </a>
      </div>

      <div
        className="hero__image"
        role="img"
        aria-label="Modern, comfortable living room"
      />
    </section>
  );
}

export default Hero;
