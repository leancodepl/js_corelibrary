export default function extractMinimalReferenceTypeName(fullName: string, currentNamespace: string | undefined) {
    const currentNamespaceParts = (currentNamespace ?? "").split(".");
    const typeParts = fullName.split(".");

    let i = 0;

    while (typeParts[i] === currentNamespaceParts[i]) {
        i++;
    }

    typeParts.splice(0, i);

    return typeParts.join(".");
}
