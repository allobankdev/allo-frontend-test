export const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "success";
    case "inactive":
      return "error";
    case "retired":
      return "warning";
    default:
      return "grey";
  }
};

export const formatStatus = (status: string) => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};
