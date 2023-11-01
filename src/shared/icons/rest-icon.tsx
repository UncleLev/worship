const ResetIcon = ({ className }: { className?: string }) => {
    return (
        <svg
            className={className}
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M20 2.5V6.38888C27.5036 6.38888 33.6111 12.4945 33.6111 20C33.6111 27.5055 27.5036 33.6111 20 33.6111C12.4964 33.6111 6.38888 27.5055 6.38888 20C6.38888 16.4086 7.81805 13.0272 10.2778 10.5072V15.1389H14.1667V4.44445H3.47222V8.33333H6.95472C4.11583 11.5067 2.5 15.6425 2.5 20C2.5 29.6483 10.3497 37.5 20 37.5C29.6503 37.5 37.5 29.6483 37.5 20C37.5 10.3517 29.6503 2.5 20 2.5Z"
                fill="currentColor"
            />
        </svg>
    );
};

export default ResetIcon;
