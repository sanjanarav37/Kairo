import {Hearts} from "react-loader-spinner";

const Spinner = () => {
  return (
    <div>
  <Hearts
  height={70}
  width={70}
  ariaLabel="heart-loading"
  visible={true}
  color="white"
  />
  </div>
);
}

  export default Spinner;