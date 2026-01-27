// return the format "May 2023"
const formatMemberSince = (dateString: string): string => {
  const date = new Date(dateString);
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();
  return `${month} ${year}`;
};

// return the format "may 15, 2023"

const formatPublishDate = (dateString: string): string => {
  const date = new Date(dateString);
  const month = date.toLocaleString("default", { month: "long" });
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
};
export { formatMemberSince, formatPublishDate };
