import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { nanoid } from 'nanoid';

const Rating = ({ value, text }) => {
  return (
    <div className='rating'>
      {/* Goes through value to assign full / half or empty star */}
      {/* 
      is value of 2.5 bigger or equal than 1 - full star
      is value of 2.5 bigger or equal than 2 - full star
      is value of 2.5 bigger or equal than 3 - no
      is value of 2.5 bigger or equal than 2.5 - half star
      is value of 2.5 bigger or equal than 4 - no
      is value of 2.5 bigger or equal than 3.5 - no
      no star
      etc...
      */}
      {Array.from({ length: 5 }, (_, i) => {
        return (
          <span key={nanoid()}>
            {value >= i + 1 ? (
              <FaStar /> //Full Star
            ) : value >= i + 1 - 0.5 ? (
              <FaStarHalfAlt /> // Half Star
            ) : (
              <FaRegStar /> // Empty Star
            )}
          </span>
        );
      })}
      <span className='rating-text'>{text ?? text}</span>
    </div>
  );
};
export default Rating;

// {
//   () => {
//     for (let i = 1; i < 6; i++) {
//       return (
//         <span>
//           {value >= i ? (
//             <FaStar /> //Full Star
//           ) : value >= i - 0.5 ? (
//             <FaStarHalfAlt /> // Half Star
//           ) : (
//             <FaRegStar /> // Empty Star
//           )}
//         </span>
//       );
//     }
//   };
// }
