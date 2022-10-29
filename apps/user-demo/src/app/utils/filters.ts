export const sortByName = (even: { readonly name: string }, odd: { readonly name: string }): number => {
  return even.name.localeCompare(odd.name);
};
