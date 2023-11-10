// import { css } from "@emotion/react";
// import styled from "@emotion/styled";
// import { UiNode, UiNodeImageAttributes } from "@ory/client";

// type NodeImageProps = {
//     node: UiNode;
//     attributes: UiNodeImageAttributes;
// };

// export function NodeImage({ attributes, node }: NodeImageProps) {
//     return (
//         <ImgWrapper
//             alt={node.meta.label?.text || ""}
//             height={attributes.height}
//             isQrCode={attributes.id === "totp_qr"}
//             src={attributes.src}
//             width={attributes.width}
//         />
//     );
// }

// const ImgWrapper = styled.img<{ isQrCode?: boolean }>`
//     ${({ isQrCode }) =>
//         isQrCode &&
//         css`
//             align-self: center;
//             margin: 8px 0;
//         `}
// `;
