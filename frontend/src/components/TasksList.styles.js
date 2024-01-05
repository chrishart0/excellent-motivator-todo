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
    width: 'max-content', // Ensure the width extends as needed
    margin: "1px",
    background: '#f4f5f7', // subtle background color
    minWidth: '100%', 
    justifyContent: 'center', 
    // space items evenly

    

};

export const KanbanColumnStyle = {
    bgcolor: "grey.200",
    height: "100%",
    padding: "5px",
    borderRadius: "5px",
    minWidth: '350px', // Adjust as needed
    border: "1px solid rgba(0, 0, 0, 0.2)",
    width: '100%',
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