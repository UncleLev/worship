
type RightArrowIconType = {
   className?: string
}

const RightArrowIcon = ({className}: RightArrowIconType) => {
return (
    <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M13.8215 32.8452C13.1706 32.1943 13.1706 31.1391 13.8215 30.4882L24.3096 20L13.8215 9.51188C13.1706 8.86104 13.1706 7.80571 13.8215 7.15488C14.4723 6.50404 15.5276 6.50404 16.1785 7.15488L27.8452 18.8215C28.1577 19.134 28.3333 19.558 28.3333 20C28.3333 20.442 28.1577 20.866 27.8452 21.1785L16.1785 32.8452C15.5276 33.4961 14.4723 33.4961 13.8215 32.8452Z"
            fill="currentColor"
        />
    </svg>
);

};

export default RightArrowIcon;