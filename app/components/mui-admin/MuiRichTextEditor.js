'use client';

import { useState, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import YouTube from '@tiptap/extension-youtube';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import CodeBlock from '@tiptap/extension-code-block';
import Placeholder from '@tiptap/extension-placeholder';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import {
  Box,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
  Tooltip,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Chip,
} from '@mui/material';
import {
  FormatBold,
  FormatItalic,
  FormatStrikethrough,
  Code,
  FormatListBulleted,
  FormatListNumbered,
  FormatQuote,
  TableChart,
  Link as LinkIcon,
  Image as ImageIcon,
  YouTube as YouTubeIcon,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  FormatAlignJustify,
  Undo,
  Redo,
  Clear,
  Palette,
  Highlight as HighlightIcon,
  CheckBox,
  Preview as PreviewIcon,
} from '@mui/icons-material';
import './MuiRichTextEditor.css';

const MuiRichTextEditor = ({
  value = '',
  onChange,
  placeholder = 'Start writing...',
  locale = 'en',
  readOnly = false,
}) => {
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [youtubeDialogOpen, setYoutubeDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [textColor, setTextColorState] = useState('#000000');
  const [highlightColor, setHighlightColor] = useState('#ffff00');
  const [previewMode, setPreviewMode] = useState(false);
  const fileInputRef = useRef();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'editor-link',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'editor-image',
        },
      }),
      YouTube.configure({
        HTMLAttributes: {
          class: 'editor-youtube',
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'editor-table',
        },
      }),
      TableRow,
      TableCell,
      TableHeader,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      TextStyle,
      Color,
      Highlight,
      CodeBlock.configure({
        HTMLAttributes: {
          class: 'editor-code-block',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
    ],
    content: value,
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  const addLink = () => {
    if (linkUrl) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
      setLinkUrl('');
      setLinkDialogOpen(false);
    }
  };

  const addImage = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl, alt: imageAlt }).run();
      setImageUrl('');
      setImageAlt('');
      setImageDialogOpen(false);
    }
  };

  const addYouTube = () => {
    if (youtubeUrl) {
      // Extract video ID from YouTube URL
      const videoId = youtubeUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i)?.[1];
      if (videoId) {
        editor.chain().focus().setYoutubeVideo({ src: `https://www.youtube.com/embed/${videoId}` }).run();
        setYoutubeUrl('');
        setYoutubeDialogOpen(false);
      }
    }
  };

  const applyTextColor = (color) => {
    editor.chain().focus().setColor(color).run();
    setTextColorState(color);
  };

  const applyHighlightColor = (color) => {
    editor.chain().focus().toggleHighlight({ color }).run();
    setHighlightColor(color);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        editor.chain().focus().setImage({ src: data.url }).run();
      }
    } catch (err) {
      alert('Image upload failed');
    }
  };

  const wordCount = editor ? editor.getText().split(/\s+/).filter(Boolean).length : 0;
  const charCount = editor ? editor.getText().length : 0;

  const translations = {
    en: {
      addLink: 'Add Link',
      linkUrl: 'Link URL',
      addImage: 'Add Image',
      imageUrl: 'Image URL',
      imageAlt: 'Alt Text',
      addYouTube: 'Add YouTube Video',
      youtubeUrl: 'YouTube URL',
      cancel: 'Cancel',
      add: 'Add',
      textColor: 'Text Color',
      highlightColor: 'Highlight Color',
    },
    bn: {
      addLink: 'লিংক যোগ করুন',
      linkUrl: 'লিংক URL',
      addImage: 'ছবি যোগ করুন',
      imageUrl: 'ছবির URL',
      imageAlt: 'Alt টেক্সট',
      addYouTube: 'YouTube ভিডিও যোগ করুন',
      youtubeUrl: 'YouTube URL',
      cancel: 'বাতিল',
      add: 'যোগ করুন',
      textColor: 'টেক্সট রঙ',
      highlightColor: 'হাইলাইট রঙ',
    },
  };

  const t = translations[locale] || translations.en;

  return (
    <Box>
      <Paper sx={{ p: 1, mb: 2 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
          {/* Headings */}
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel>Heading</InputLabel>
            <Select
              value={
                editor.isActive('heading', { level: 1 }) ? 'h1' : 
                editor.isActive('heading', { level: 2 }) ? 'h2' : 
                editor.isActive('heading', { level: 3 }) ? 'h3' : 
                editor.isActive('heading', { level: 4 }) ? 'h4' : 
                editor.isActive('heading', { level: 5 }) ? 'h5' : 
                editor.isActive('heading', { level: 6 }) ? 'h6' : 
                'p'
              }
              label="Heading"
              onChange={e => {
                const val = e.target.value;
                if (val === 'p') {
                  editor.chain().focus().setParagraph().run();
                } else {
                  const level = parseInt(val[1]);
                  editor.chain().focus().toggleHeading({ level }).run();
                }
              }}
            >
              <MenuItem value="p">Paragraph</MenuItem>
              <MenuItem value="h1">Heading 1</MenuItem>
              <MenuItem value="h2">Heading 2</MenuItem>
              <MenuItem value="h3">Heading 3</MenuItem>
              <MenuItem value="h4">Heading 4</MenuItem>
              <MenuItem value="h5">Heading 5</MenuItem>
              <MenuItem value="h6">Heading 6</MenuItem>
            </Select>
          </FormControl>
          {/* Text formatting group */}
          <ToggleButtonGroup size="small" value="" exclusive>
            <Tooltip title="Bold"><ToggleButton value="bold" selected={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}><FormatBold /></ToggleButton></Tooltip>
            <Tooltip title="Italic"><ToggleButton value="italic" selected={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}><FormatItalic /></ToggleButton></Tooltip>
            <Tooltip title="Underline"><ToggleButton value="underline" selected={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}><span style={{ textDecoration: 'underline', fontWeight: 'bold' }}>U</span></ToggleButton></Tooltip>
            <Tooltip title="Strikethrough"><ToggleButton value="strike" selected={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()}><FormatStrikethrough /></ToggleButton></Tooltip>
            <Tooltip title="Clear Formatting"><ToggleButton value="clear" onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}><Clear /></ToggleButton></Tooltip>
          </ToggleButtonGroup>
          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
          {/* Color pickers */}
          <Tooltip title={t.textColor}><IconButton size="small" onClick={() => applyTextColor('#ff0000')}><Palette sx={{ color: '#ff0000' }} /></IconButton></Tooltip>
          <Tooltip title={t.highlightColor}><IconButton size="small" onClick={() => applyHighlightColor('#ffff00')}><HighlightIcon sx={{ color: '#ffff00' }} /></IconButton></Tooltip>
          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
          {/* Alignment group */}
          <ToggleButtonGroup size="small" value="" exclusive>
            <Tooltip title="Align Left"><ToggleButton value="left" selected={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()}><FormatAlignLeft /></ToggleButton></Tooltip>
            <Tooltip title="Align Center"><ToggleButton value="center" selected={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()}><FormatAlignCenter /></ToggleButton></Tooltip>
            <Tooltip title="Align Right"><ToggleButton value="right" selected={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()}><FormatAlignRight /></ToggleButton></Tooltip>
            <Tooltip title="Justify"><ToggleButton value="justify" selected={editor.isActive({ textAlign: 'justify' })} onClick={() => editor.chain().focus().setTextAlign('justify').run()}><FormatAlignJustify /></ToggleButton></Tooltip>
          </ToggleButtonGroup>
          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
          {/* Lists group */}
          <ToggleButtonGroup size="small" value="" exclusive>
            <Tooltip title="Bullet List"><ToggleButton value="bulletList" selected={editor.isActive('bulletList')} onClick={() => {
              const { from, to, empty } = editor.state.selection;
              if (!empty && from !== to) {
                editor.chain().focus().splitBlock().run();
              }
              editor.chain().focus().toggleBulletList().run();
            }}><FormatListBulleted /></ToggleButton></Tooltip>
            <Tooltip title="Numbered List"><ToggleButton value="orderedList" selected={editor.isActive('orderedList')} onClick={() => {
              const { from, to, empty } = editor.state.selection;
              if (!empty && from !== to) {
                editor.chain().focus().splitBlock().run();
              }
              editor.chain().focus().toggleOrderedList().run();
            }}><FormatListNumbered /></ToggleButton></Tooltip>
            <Tooltip title="Task List"><ToggleButton value="taskList" selected={editor.isActive('taskList')} onClick={() => {
              const { from, to, empty } = editor.state.selection;
              if (!empty && from !== to) {
                editor.chain().focus().splitBlock().run();
              }
              editor.chain().focus().toggleTaskList().run();
            }}><CheckBox /></ToggleButton></Tooltip>
          </ToggleButtonGroup>
          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
          {/* Block group */}
          <ToggleButtonGroup size="small" value="" exclusive>
            <Tooltip title="Blockquote"><ToggleButton value="blockquote" selected={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}><FormatQuote /></ToggleButton></Tooltip>
            <Tooltip title="Code Block"><ToggleButton value="codeBlock" selected={editor.isActive('codeBlock')} onClick={() => editor.chain().focus().toggleCodeBlock().run()}><Code /></ToggleButton></Tooltip>
            <Tooltip title="Divider"><ToggleButton value="divider" onClick={() => editor.chain().focus().setHorizontalRule().run()}><span style={{ fontWeight: 'bold' }}>―</span></ToggleButton></Tooltip>
            <Tooltip title="Table"><ToggleButton value="table" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}><TableChart /></ToggleButton></Tooltip>
          </ToggleButtonGroup>
          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
          {/* Media group */}
          <ToggleButtonGroup size="small" value="" exclusive>
            <Tooltip title="Add Link"><ToggleButton value="link" selected={editor.isActive('link')} onClick={() => setLinkDialogOpen(true)}><LinkIcon /></ToggleButton></Tooltip>
            <Tooltip title="Add Image"><ToggleButton value="image" onClick={() => fileInputRef.current.click()}><ImageIcon /></ToggleButton></Tooltip>
            <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleImageUpload} />
            <Tooltip title="Add YouTube Video"><ToggleButton value="youtube" onClick={() => setYoutubeDialogOpen(true)}><YouTubeIcon /></ToggleButton></Tooltip>
          </ToggleButtonGroup>
          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
          {/* Undo/Redo */}
          <Tooltip title="Undo"><IconButton size="small" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}><Undo /></IconButton></Tooltip>
          <Tooltip title="Redo"><IconButton size="small" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}><Redo /></IconButton></Tooltip>
          {/* Preview toggle */}
          <Tooltip title={previewMode ? 'Edit Mode' : 'Preview Mode'}><IconButton size="small" onClick={() => setPreviewMode(!previewMode)}><PreviewIcon color={previewMode ? 'primary' : 'inherit'} /></IconButton></Tooltip>
        </Box>
      </Paper>
      {/* Editor/Preview area */}
      <Paper sx={{ p: 2, minHeight: 300, border: previewMode ? '2px solid #1976d2' : '1px solid #ccc', background: previewMode ? '#f5faff' : '#fff' }}>
        {previewMode ? (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Preview</Typography>
            <div dangerouslySetInnerHTML={{ __html: editor.getHTML() }} />
          </Box>
        ) : (
          <EditorContent editor={editor} />
        )}
      </Paper>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1, gap: 2 }}>
        <Typography variant="caption">Words: {wordCount}</Typography>
        <Typography variant="caption">Characters: {charCount}</Typography>
      </Box>
      {/* Link Dialog */}
      <Dialog open={linkDialogOpen} onClose={() => setLinkDialogOpen(false)}>
        <DialogTitle>{t.addLink}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label={t.linkUrl}
            type="url"
            fullWidth
            variant="outlined"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLinkDialogOpen(false)}>{t.cancel}</Button>
          <Button onClick={addLink} variant="contained">{t.add}</Button>
        </DialogActions>
      </Dialog>

      {/* Image Dialog */}
      <Dialog open={imageDialogOpen} onClose={() => setImageDialogOpen(false)}>
        <DialogTitle>{t.addImage}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label={t.imageUrl}
            type="url"
            fullWidth
            variant="outlined"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label={t.imageAlt}
            fullWidth
            variant="outlined"
            value={imageAlt}
            onChange={(e) => setImageAlt(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImageDialogOpen(false)}>{t.cancel}</Button>
          <Button onClick={addImage} variant="contained">{t.add}</Button>
        </DialogActions>
      </Dialog>

      {/* YouTube Dialog */}
      <Dialog open={youtubeDialogOpen} onClose={() => setYoutubeDialogOpen(false)}>
        <DialogTitle>{t.addYouTube}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label={t.youtubeUrl}
            type="url"
            fullWidth
            variant="outlined"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setYoutubeDialogOpen(false)}>{t.cancel}</Button>
          <Button onClick={addYouTube} variant="contained">{t.add}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MuiRichTextEditor; 