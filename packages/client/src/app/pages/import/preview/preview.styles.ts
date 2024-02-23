import styled from 'styled-components';

const chunkWidth = 22;

export const PreviewWrapper = styled.div`
  //
`;

export const FileList = styled.div`
  padding: 10px;

  background: #f4f7fd;
  border: 1px solid #e1e5ea;
  border-radius: 3px;
`;

type LabelProps = {
  $light?: boolean;
};

export const Label = styled.label<LabelProps>`
  flex: 1;
  padding: 0 4px;

  text-align: left;
  font-weight: ${({ $light }) => ($light ? 'normal' : 'bold')};
`;

export const ListItem = styled.li``;

export const Blocks = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
`;

type SpacerProps = {
  $width?: number;
  $dash?: boolean;
};

export const Spacer = styled.div<SpacerProps>`
  position: relative;
  flex-basis: ${({ $width = 1 }) => $width * chunkWidth}px;

  &:before {
    content: '';

    position: absolute;
    left: 2px;
    right: 2px;
    top: -1px;

    display: ${({ $dash }) => ($dash ? 'block' : 'none')};
    height: 2px;

    background: #b9c6d7;
  }
`;

export const BlockItem = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  flex: 0 0 ${chunkWidth}px;
  height: 24px;
`;

export const Directory = styled.i.attrs((props) => ({
  className: props.className || 'fa-solid fa-folder',
}))`
  flex: 0 0 ${chunkWidth}px;
  font-size: 18px;

  text-align: center;
`;

export const File = styled.i.attrs((props) => ({
  className: props.className || 'fa-light fa-file-code',
}))`
  flex: 0 0 ${chunkWidth}px;
  font-size: 18px;

  text-align: center;
`;

// .file-list {
//   ul {
//     li {
//       .blocks {
//         display: flex;
//         align-items: center;
//         justify-content: start;

//         $width: 26px;

//         > div {
//           flex: 0 0 $width;
//           height: 24px;
//           text-align: center;

//           &.spacer {
//             position: relative;

//             &:not(.spacer-empty):before {
//               content: '';

//               position: absolute;
//               left: 4px;
//               right: 4px;
//               top: 9px;

//               display: block;
//               height: 2px;

//               background: #b9c6d7;
//             }

//             @for $i from 1 through 12 {
//               &-#{$i} {
//                 flex: 0 0 ($width * $i);
//               }
//             }
//           }

//           &.option {
//           }

//           &.label {
//             flex: 1;
//             text-align: left;
//           }
//         }
//       }

//       i {
//         display: block;
//         font-size: 18px;
//       }
//     }
//   }
// }
