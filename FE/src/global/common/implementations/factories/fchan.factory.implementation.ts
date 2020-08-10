import { Observable } from 'rxjs';

export abstract class FChanFactoryImplementation {

    // https://github.com/4chan/4chan-API

    abstract getBoards(): Observable<{ success: boolean; response: GetBoardsJSON; }>;

    abstract getThreads(board: string): Observable<{ success: boolean; response: GetThreadsJSON; }>;

    abstract getCatalog(board: string): Observable<{ success: boolean; response: GetCatalogJSON; }>;

    abstract getArchive(board: string): Observable<{ success: boolean; response: GetArchiveJSON; }>;

    abstract getPage(board: string, page: number): Observable<{ success: boolean; response: GetPageJSON; }>;

    abstract getPosts(board: string, no: number): Observable<{ success: boolean; response: GetPostsJSON; }>;

    // STATIC

    public static getBoardsUrl(): string {
        return `https://a.4cdn.org/boards.json`;
    }

    public static getThreadsUrl(board: string): string {
        return `https://a.4cdn.org/${board}/threads.json`;
    }

    public static getCatalogUrl(board: string): string {
        return `https://a.4cdn.org/${board}/catalog.json`;
    }

    public static getArchiveUrl(board: string): string {
        return `https://a.4cdn.org/${board}/archive.json`;
    }

    public static getPageUrl(board: string, page: number): string {
        return `https://a.4cdn.org/${board}/${page}.json`;
    }

    public static getPostsUrl(board: string, no: number): string {
        return `https://a.4cdn.org/${board}/thread/${no}.json`;
    }

    // MEDIA

    public static getUserImageUrl(board: string, tim: number, ext: '.jpg' | '.png' | '.gif' | '.pdf' | '.swf' | '.webm', thumbnail?: boolean): string {
        return `https://i.4cdn.org/${board}/${tim}${thumbnail ? `s` : ``}${ext}`;
    }

    public static getCountryFlagUrl(country: string, troll?: boolean): string {
        return `https://s.4cdn.org/image/country/${troll ? `troll/` : ``}${country}.gif`;
    }

    public static getSpoilerImageUrl(custom?: { board: string; n: string; }): string {
        return `https://s.4cdn.org/image/spoiler${custom ? `-${custom.board}${custom.n}` : ``}.png`;
    }

    public static getSpecialIconUrl(icon: 'closed' | 'sticky' | 'adminicon' | 'modicon' | 'developericon' | 'managericon' | 'foundericon' | 'filedeleted' | 'filedeleted-res'): string {
        return `https://s.4cdn.org/image/${icon}.gif`;
    }

}

export type GetBoardsJSON = { boards: Board[]; troll_flags: { [acronym: string]: string; } };
export type GetThreadsJSON = { page: number; threads: ThreadThread[]; }[];
export type GetCatalogJSON = { page: number; threads: CatalogThread[]; }[];
export type GetArchiveJSON = number[];
export type GetPageJSON = { threads: { posts: PagePost[] }[]; };
export type GetPostsJSON = { posts: PostPost[]; };

export type ThreadThread = Pick<Thread, 'no' | 'last_modified' | 'replies'>;
export type CatalogThread = Omit<Thread, 'archived' | 'archived_on'>;
export type PagePost = Omit<Thread, 'last_replies' | 'archived' | 'archived_on'>;
export type PostPost = Omit<Thread, 'omitted_posts' | 'omitted_images' | 'last_modified' | 'last_replies'>;
export type LastReplyThread = Pick<Thread, 'no' | 'now' | 'name' | 'com' | 'filename' | 'ext' | 'w' | 'h' | 'tn_w' | 'tn_h' | 'tim' | 'time' | 'md5' | 'fsize' | 'resto'>;

export interface Board {
    board: string; // The directory the board is located in
    title: string; // The readable title at the top of the board
    ws_board: 0 | 1;// Is the board worksafe
    per_page: number; // How many threads are on a single index page
    pages: number; // How many index pages does the board have
    max_filesize: number; // Maximum file size allowed for non .webm attachments (in KB)
    max_webm_filesize: number; // Maximum file size allowed for .webm attachments (in KB)
    max_comment_chars: number; // Maximum number of characters allowed in a post comment
    max_webm_duration: number; // Maximum duration of a .webm attachment (in seconds)
    bump_limit: number; // Maximum number of replies allowed to a thread before the thread stops bumping
    image_limit: number; // Maximum number of image replies per thread before image replies are discarded
    cooldowns: {
        threads: number;
        replies: number;
        images: number;
    };
    meta_description: string; // SEO meta description content for a board
    spoilers?: 0 | 1; // Are spoilers enabled
    custom_spoilers?: number; // How many custom spoilers does the board have
    is_archived?: 0 | 1; // Are archives enabled for the board
    troll_flags?: 0 | 1; // Are troll flags enabled on the board
    country_flags?: 0 | 1; // Are flags showing the poster's country enabled on the board
    user_ids?: 0 | 1; // Are poster ID tags enabled on the board
    oekaki?: 0 | 1; // Can users submit drawings via browser the Oekaki app
    sjis_tags?: 0 | 1; // Can users submit sjis drawings using the [sjis] tags
    code_tags?: 0 | 1; // Can poster use code syntax highlighting using the [code] tags
    text_only?: 0 | 1; // Is image posting disabled for the board
    forced_anon?: 0 | 1; // Is the name field disabled on the board
    webm_audio?: 0 | 1; // Are webms with audio allowed?
    require_subject?: 0 | 1; // Do OPs require a subject
    min_image_width?: number; // What is the minimum image width (in pixels)
    min_image_height?: number; // What is the minimum image height (in pixels)
}

export interface Thread {
    no: number; // The numeric post ID
    resto: number; // For replies: this is the ID of the thread being replied to. For OP: this value is zero
    sticky?: 1; // If the thread is being pinned to the top of the page
    closed?: 1; // If the thread is closed to replies
    now: string; // MM/DD/YY(Day)HH:MM (:SS on some boards), EST/EDT timezone
    time: number; // UNIX timestamp the post was created
    name: string; // Name user posted with. Defaults to Anonymous
    trip?: string; // The user's tripcode, in format: !tripcode or !!securetripcode
    id?: string; // The poster's ID
    capcode?: 'mod' | 'admin' | 'admin_highlight' | 'manager' | 'developer' | 'founder'; // The capcode identifier for a post
    country?: string; // Poster's ISO 3166-1 alpha-2 country code
    country_name?: string; // Poster's country name
    sub?: string; // OP Subject text
    com?: string; // Comment (HTML escaped)
    tim?: number; // Unix timestamp + microtime that an image was uploaded
    filename?: string; // Filename as it appeared on the poster's device
    ext?: '.jpg' | '.png' | '.gif' | '.pdf' | '.swf' | '.webm'; // Filetype
    fsize?: number; // Size of uploaded file in bytes
    md5?: string; // 24 character, packed base64 MD5 hash of file
    w?: number; // Image width dimension
    h?: number; // Image height dimension
    tn_w?: number; // Thumbnail image width dimension
    tn_h?: number; // Thumbnail image height dimension
    filedeleted?: 1; // If the file was deleted from the post
    spoiler?: 1; // If the image was spoilered or not
    custom_spoiler?: number; // The custom spoiler ID for a spoilered image
    omitted_posts?: number; // Number of replies minus the number of previewed replies
    omitted_images?: number; // Number of image replies minus the number of previewed image replies
    replies?: number; // Total number of replies to a thread
    images?: number; // Total number of image replies to a thread
    bumplimit?: 1; // If a thread has reached bumplimit, it will no longer bump
    imagelimit?: 1; // If an image has reached image limit, no more image replies can be made
    last_modified?: number; // The UNIX timestamp marking the last time the thread was modified (post added/modified/deleted, thread closed/sticky settings modified)
    tag?: string; // The category of .swf upload
    semantic_url?: string; // SEO URL slug for thread
    since4pass?: number; // Year 4chan pass bought
    unique_ips?: number; // Number of unique posters in a thread
    m_img?: 1; // Mobile optimized image exists for post
    last_replies?: LastReplyThread[]; // JSON representation of the most recent replies to a thread
    archived?: 1; // Thread has reached the board's archive
    archived_on?: number; // Thread has reached the board's archive
}
