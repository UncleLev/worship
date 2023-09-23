type LeftArrowIconType = {
    className?: string;
};

const LeftArrowIcon = ({ className }: LeftArrowIconType) => {
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
                d="M26.1785 7.15478C26.8294 7.80566 26.8294 8.86093 26.1785 9.51181L15.6904 20L26.1785 30.4881C26.8294 31.139 26.8294 32.1943 26.1785 32.8451C25.5277 33.496 24.4724 33.496 23.8215 32.8451L12.1548 21.1785C11.8423 20.866 11.6667 20.442 11.6667 20C11.6667 19.558 11.8423 19.134 12.1548 18.8215L23.8215 7.15478C24.4724 6.50391 25.5277 6.50391 26.1785 7.15478Z"
                fill="currentColor"
            />
        </svg>
    );
};

export default LeftArrowIcon;
