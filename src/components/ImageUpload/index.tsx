import React, { useCallback, useEffect, useMemo } from 'react';
import { useImmer } from 'use-immer';
import { Upload, Image } from 'antd';
import ImgCrop from 'antd-img-crop';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { getBase64 } from './utils';

export interface ImageFileUploadProps {
  type?: 'file';
  value?: File | string;
  onChange?: (file: File) => void;
}

export interface ImageUriUploadProps {
  type?: 'uri';
  value?: string;
  onChange?: (url: string) => void;
  onUpload: (
    file: File,
    action: {
      change: (value: string) => void;
      done: () => void;
    },
  ) => void;
}

export type ImageUploadProps = ImageFileUploadProps | ImageUriUploadProps;
/**
 * @description 该组件需要放在 Form 里面，type 为 uri 时必须要实现 onUpload 方法，该方法有一个 action 参数，可以实现改变值和单纯的改变 loading 状态
 */
export const ImageUpload: React.FC<ImageUploadProps> = (props) => {
  const [state, setState] = useImmer({
    imgLoading: false,
    imageUrl: '',
  });

  const uploadButton = useMemo(
    () => (
      <div>
        {state.imgLoading ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>点击上传</div>
      </div>
    ),
    [state.imgLoading],
  );

  const handleUriChange = useCallback(
    (value: string) => {
      if (props.type === 'uri') {
        props.onChange && props.onChange(value);
        setState((draft) => {
          draft.imgLoading = false;
        });
      }
    },
    [props.onChange, props.type, setState],
  );

  const handleFileChange = useCallback(
    (file: File) => {
      if (props.type === 'file') {
        setState((draft) => {
          draft.imgLoading = false;
        });
        props.onChange && props.onChange(file);
      }
    },
    [props.onChange, props.type, setState],
  );

  const handleDone = useCallback(() => {
    setState((draft) => {
      draft.imgLoading = false;
    });
  }, [setState]);

  useEffect(() => {
    if (props.value) {
      if (typeof props.value === 'string') {
        setState((draft) => {
          draft.imageUrl = props.value as string;
        });
      } else {
        getBase64(props.value).then((res) => {
          setState((draft) => {
            draft.imageUrl = res;
          });
        });
      }
    }
  }, [props.value]);
  return (
    <ImgCrop rotate grid>
      <Upload
        transformFile={undefined}
        accept="image/*"
        listType="picture-card"
        showUploadList={false}
        onChange={(info) => {
          if (info.file.status === 'uploading') {
            setState((draft) => {
              draft.imgLoading = true;
            });
            return;
          }
          if (info.file.status === 'done') {
            if (props.type === 'uri') {
              props.onUpload &&
                props.onUpload(info.file.originFileObj as File, {
                  change: handleUriChange,
                  done: handleDone,
                });
            } else if (props.type === 'file') {
              handleFileChange(info.file.originFileObj as File);
            }
          }
        }}
      >
        {state.imageUrl ? (
          <Image
            src={state.imageUrl}
            alt="cover"
            width="100%"
            height="100%"
            preview={false}
          />
        ) : (
          uploadButton
        )}
      </Upload>
    </ImgCrop>
  );
};

ImageUpload.defaultProps = {
  type: 'file',
};

export default ImageUpload;
