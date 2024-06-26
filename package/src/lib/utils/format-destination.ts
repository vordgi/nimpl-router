export const formatDestination = (destination: string, groups: { [key: string]: string }) => {
    const formattedDestination = Object.entries(groups).reduce(
        (acc, [key, value]) => acc.replace(`:${key}`, value),
        destination,
    );
    return formattedDestination;
};
