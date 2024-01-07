import { Alert } from 'react-bootstrap';

// variant - danger, warning, success, children is text passed in
const Message = ({ variant = 'info', children }) => {
  return <Alert variant={variant}>{children}</Alert>;
};

// old school
// Message.defaultProps = {
//   variant: 'info',
// };

export default Message;
