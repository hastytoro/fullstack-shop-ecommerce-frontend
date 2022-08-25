import Link from "next/link";
import styled from "styled-components";

export default function Product({ product }) {
  // Extract information from prop
  const { slug, title, price, image } = product.attributes;
  const imgUrl = image.data.attributes.formats.small.url;
  return (
    <ProductWrapper>
      <Link href={`/product/${slug}`}>
        <ImageWrapper>
          <img src={imgUrl} alt="" />
        </ImageWrapper>
      </Link>
      <h4>{title}</h4>
      <p>{price}$</p>
    </ProductWrapper>
  );
}

const ProductWrapper = styled.div`
  background: white;
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.18) 0px 2px 4px;
  max-height: 22rem;
  img {
    /* testing */
    width: 80%;
    height: 80%;
    /* ... */
    object-fit: contain;
  }
  h2,
  h3,
  h4 {
    padding: 0.2rem 0rem;
    color: var(--secondary);
  }
  transition: scale 0.2s ease-in-out;
  &:hover {
    scale: 0.98;
  }
`;

const ImageWrapper = styled.div`
  flex: 1 1 20rem;
  /* centering images */
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  cursor: pointer;
`;
