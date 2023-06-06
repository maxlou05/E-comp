export function FormatDate(date) {
    const FormattedDate = new Date(date).toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"})
    return FormattedDate
}