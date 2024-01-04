export const EditItemModalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    width: '80%', // more responsive
    maxWidth: '500px', // maximum width
    typography: 'body1', // MUI typography variant
};

export const KanbanBoardStyle = {
    display: 'flex',
    flexDirection: 'row', // Keep items in a row
    width: 'max-content', // Ensure the width extends as needed
    paddingTop: '20px',
    paddingLeft: "5px",
    passingRight: "5px",
    margin: "5px",
    justifyContent: "space-between",
    alignItems: "flex-start",
    background: '#f4f5f7', // subtle background color

};

export const KanbanColumnStyle = {
    bgcolor: "grey.200",
    minHeight: "20vh",
    padding: "5px",
    borderRadius: "5px",
    minWidth: '350px', // Adjust as needed
    maxWidth: '450px', // Prevent columns from getting too wide on larger screens
    border: "1px solid rgba(0, 0, 0, 0.2)",
    '&:hover': {
        boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.15)', // more pronounced shadow on hover
    },
    marginBottom: '10px', // space between stacked columns on small screens
};

export const ColumnHeaderStyle = {
    position: 'sticky',
    top: 0, // Adjust based on your header's height
    zIndex: 1,
    backgroundColor: 'inherit', // Or any color that fits your design
    marginBottom: "3px",
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)', // subtle separation
};