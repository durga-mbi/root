export interface Specification {
    key: string;
    value: string;
}

/**
 * Parses a raw specification string into an array of Key-Value pairs.
 * Supports delimiters like ":" or "-" and one specification per line.
 */
export const parseSpecifications = (specString: string): Specification[] => {
    if (!specString) return [];

    return specString
        .split('\n')
        .map(line => {
            const trimmedLine = line.trim();
            if (!trimmedLine) return null;

            // Split by : or - (first occurrence only)
            const match = trimmedLine.match(/^([^:-]+)[:\-](.+)$/);
            if (match) {
                return {
                    key: match[1].trim(),
                    value: match[2].trim()
                };
            }

            // Fallback if no delimiter, use the whole line as value and "Info" as key or just return as is
            return {
                key: "Info",
                value: trimmedLine
            };
        })
        .filter((spec): spec is Specification => spec !== null);
};
