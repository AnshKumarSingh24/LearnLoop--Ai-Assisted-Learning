import { useDarwinity } from "@/contexts/DarwinityStoreContext";
import { useCompanion } from "@/contexts/CompanionContext";
import { useEffect } from "react";
import { useParams } from "wouter";
import { WriteDrawEditor } from "@/components/notes/WriteDrawEditor";

export default function PageEditor() {
  const { spaceId, pageId } = useParams();
  const { state, dispatch } = useDarwinity();
  const { setContext } = useCompanion();

  const space = state.spaces.find(s => s.id === spaceId);
  const page = state.pages.find(p => p.id === pageId);
  const blocks = (state.blocks || []).filter(b => b.pageId === pageId).sort((a, b) => a.order - b.order);

  useEffect(() => {
    dispatch({ type: "SET_ACTIVE_SPACE", id: spaceId || null });
    dispatch({ type: "SET_ACTIVE_PAGE", id: pageId || null });
    if (space && page) {
      setContext({ workspace: "Spaces", spaceId: space.id, pageId: page.id, selection: `${space.name} / ${page.title}` });
    }
  }, [spaceId, pageId, space, page, dispatch, setContext]);

  if (!space || !page) return <div className="p-10 text-gray-600">Page not found</div>;

  const initialContent = blocks.map(b => {
    if (b.type === "heading") return `<h2>${b.content.text || ""}</h2>`;
    if (b.type === "bullet") return `<ul><li>${b.content.text || ""}</li></ul>`;
    return `<p>${b.content.text || ""}</p>`;
  }).join("");

  const handleSave = ({ title, content }: { title: string; content: string }) => {
    if (title !== page.title) {
      dispatch({ type: "UPDATE_PAGE", id: page.id, patch: { title } });
    }
    if (blocks[0]) {
      dispatch({ type: "UPDATE_BLOCK", id: blocks[0].id, patch: { content: { text: content } } });
    } else {
      dispatch({ type: "CREATE_BLOCK", block: { id: `b-${Date.now()}`, pageId: page.id, parentId: null, type: "paragraph", content: { text: content }, order: 0 } });
    }
  };

  return (
    <div className="w-full h-full">
      <WriteDrawEditor
        initialTitle={page.title}
        initialContent={initialContent}
        onSave={handleSave}
      />
    </div>
  );
}
