import { Pagination } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const Paginate = ({ pages, page, isAdmin = false, keyword = '' }) => {
  return (
    <>
      {pages > 1 && (
        <Pagination>
          {/* [...Array(2).keys()] returns // [0, 1] */}
          {[...Array(pages).keys()].map((x) => (
            <LinkContainer
              key={x + 1}
              // admin gets to go to routes that are not available to regular users and where they can edit and delete products
              to={
                !isAdmin
                  ? keyword
                    ? `/search/${keyword}/page/${x + 1}`
                    : `/page/${x + 1}`
                  : `/admin/productlist/${x + 1}`
              }
            >
              {/* active prop is used to highlight the current page */}
              <Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>
            </LinkContainer>
          ))}
        </Pagination>
      )}
    </>
  );
};

export default Paginate;
