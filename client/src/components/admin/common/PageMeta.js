import { HelmetProvider, Helmet } from 'react-helmet-async';

// Component để thiết lập meta thông tin cho trang
const PageMeta = ({ title, description }) => (
  <Helmet>
    <title>{title}</title>
    <meta name="description" content={description} />
  </Helmet>
);

// Component để bọc ứng dụng và sử dụng HelmetProvider
export const AppWrapper = ({ children }) => <HelmetProvider>{children}</HelmetProvider>;

export default PageMeta;
