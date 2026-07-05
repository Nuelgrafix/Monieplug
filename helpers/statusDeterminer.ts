export const statusDetermine = (status: number) => {
  if (status === 0) {
    return "Under Review";
  } else if (status === 1) {
    return "Approved";
  } else {
    return "Rejected";
  }
};
